import "dotenv/config";
import speakeasy from "speakeasy";
import { User } from "../types/userTypes.js";
import { DBPool } from "../db/index.js";

export async function userByIdService(id: number) {
  const client = await DBPool.connect();
  const result = await client.query(`select * from users where id=${id}`);
  client.release();
  const user = await result.rows[0];
  return user;
}

export async function userListService() {
  const client = await DBPool.connect();
  const result = await client.query(`select * from users`);
  client.release();
  const users = result.rows;
  return users;
}

export async function userCreateService(user: User) {
  const client = await DBPool.connect();
  const result = await client.query(
    `INSERT INTO users (email, name, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
    [user.email, user.name, user.password, user.role]
  );
  const id = result.rows[0].id;
  const createdUser = await userByIdService(id);
  const { password, ...userWithouPassword } = await createdUser;
  client.release();
  return userWithouPassword;
}

export async function loginService(email: string) {
  const client = await DBPool.connect();

  const result = await client.query(`select * from users where email=$1`, [email]);
  client.release();
  return result.rows[0]
}

export async function userUpdateService(data: User) {
  const client = await DBPool.connect();
  const result = await client.query(`update users
    set name=$1, email=$2, is_mfa_enabled=$3, secret_mfa=$4, role=$5
    where id=$6
    returning id`, [data.name, data.email, data.is_mfa_enabled, data.secret_mfa, data.role, data.id]);
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
  if (user.secret_mfa) {
    const codeValidity = speakeasy.totp.verify({
      secret: user.secret_mfa,
      encoding: "base32",
      token: code,
      window: 2, // default 0, for security reasons 0 is the best
    });
    return codeValidity
  } else {
    return false
  }
};
