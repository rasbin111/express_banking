import "dotenv/config";

import {Pool, Client} from "pg";

let DB_USER = process.env.DB_USER;
let DB_PASSWORD = process.env.DB_PASSWORD;
let DB_HOST = process.env.DB_HOST;
let DB_PORT = parseInt(process.env.DB_PORT || "5432");

let DB_NAME = process.env.DB_NAME;

export const DBPool = new Pool({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME
});

// export const DBClient = await DBPool.connect()


