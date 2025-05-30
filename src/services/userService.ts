import "dotenv/config";
import speakeasy from "speakeasy";
import { User } from "../types/userTypes.js";
import { DBPool } from "../db/index.js";

export async function userByIdService(id: number) {
  const client = await DBPool.connect();
  const result = await client.query(`select * from "User" where id=${id}`);
  client.release();
  const user = await result.rows[0];
  return user;
}

export async function userListService() {
  const client = await DBPool.connect();
  const result = await client.query('select * from "User";');
  client.release();
  const users = result.rows;
  return users;
}

export async function userCreateService(user: User) {
  const client = await DBPool.connect();
  const result = await client.query(
    `INSERT INTO "User" (email, name, password)
         VALUES ($1, $2, $3)
         RETURNING id`,
    [user.email, user.name, user.password]
  );
  const id = result.rows[0].id;
  const createdUser = await userByIdService(id);
  const { password, ...userWithouPassword } = await createdUser;
  client.release();
  return userWithouPassword;
}

export async function loginService(email: string) {
  const client = await DBPool.connect();

  const result = await client.query(`select * from "User" where email=$1`, [email]);
  client.release();
  return result.rows[0]
}

export async function userUpdateService(data: User) {
  const client = await DBPool.connect();
  const result = await client.query(`update "User" 
    set name=$1, email=$2, "isMFAEnabled"=$3, "secretMFA"=$4
    where id=$5
    returning id`, [data.name, data.email, data.isMFAEnabled, data.secretMFA, data.id]);
  const user = userByIdService(result.rows[0].id)
  client.release();
  return user
}

export function getMFACode({ email }: { email?: string }): {
  otpauthUrl: string;
  base32: string;
} {
  const secret = speakeasy.generateSecret({
    name: `${process.env.APP_NAME} | ${email}`,
    length: 20
  });
  return {
    otpauthUrl: secret.otpauth_url ?? "",
    base32: secret.base32,
  };
}

export const verifyMFACode = async (code: string, user: User) => {
  console.log()
  if (user.secretMFA) {
    const codeValidity = speakeasy.totp.verify({
      secret: user.secretMFA,
      encoding: "base32",
      token: code,
      window: 2, // default 0, for security reasons 0 is the best
    });
    return codeValidity
  } else {
    return false
  }
};
