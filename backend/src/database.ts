import pkg from 'pg';
const { Pool } = pkg;

import { config } from 'dotenv';
config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
  throw new Error("Missing required environment variables");
}

export const pool = new Pool({
    host: PGHOST,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: true
});

export async function getFees(token: string, _connection: any) {
    const connection = await pool.connect();
    // const query = 
    //     `SELECT 'withdrawal' AS type, e.name AS exchange_name, wf.fee_amount AS fee
    //     FROM withdrawal_fee wf
    //     JOIN exchange e ON wf.exchange_id = e.exchange_id
    //     WHERE wf.token = ${token};
    //     `;

    const query = "SELECT * FROM withdrawal_fee;";

    try {
        const result = await connection.query(query);
        console.log(result);
        return result;
    } catch (error) {
        console.log("Error reading from fees database: " + error)
    }
}
