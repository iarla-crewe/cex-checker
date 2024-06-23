import pkg from 'pg';
const { Pool } = pkg;

import { config } from 'dotenv';
import { Prices } from './types';
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

export async function getFees(token: string) {
    let fees: Prices = {
        binance: 100,
        kraken: 100,
        coinbase: 100,
        crypto_com: 100,
        bybit: 100,
        jupiter: 100,
        oneInch: 100
    }
    return fees;
    const query = 
        `SELECT 'withdrawal' AS type, e.name AS exchange_name, wf.fee_amount AS fee
        FROM withdrawal_fee wf
        JOIN exchange e ON wf.exchange_id = e.exchange_id
        WHERE wf.token = $1;`;

    try {
        const connection = await pool.connect();
        const result = await connection.query(query, [token]);

        const withdrawalFees  = result.rows.map(obj => ({ ...obj, token: `${token}` }));
        for(const cex in fees) {
            //@ts-ignore
            let matchingObject = withdrawalFees.find(obj => obj.exchange_name == cex.name && obj.token == tokenA);
            if (matchingObject) fees[cex] = matchingObject.fee;
        }
    } catch (error) {
        console.log("[Error] Could not read from fees database: " + error)
    } finally {
        return fees;
    }
}
