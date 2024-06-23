import pkg from 'pg';
const { Pool } = pkg;

import { config } from 'dotenv';
import { Prices } from './types';
config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
  throw new Error("Missing required environment variables");
}

const pool = new Pool({
    host: PGHOST,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: true
}).connect();

export async function getFees(token: string) {
    let fees: Prices = {
        binance: 0,
        kraken: 0,
        coinbase: 0,
        crypto_com: 0,
        bybit: 0,
        jupiter: 0,
        oneInch: 0
    }
    const query = 
        `SELECT 'withdrawal' AS type, e.name AS exchange_name, wf.fee_amount AS fee
        FROM withdrawal_fee wf
        JOIN exchange e ON wf.exchange_id = e.exchange_id
        WHERE wf.token = $1;`;

    try {
        const connection = await pool;
        const result = await connection.query(query, [token]);

        for(const cex in fees) {
            let cexRow = result.rows.find(obj => obj.exchange_name === cex);
            if (cexRow) fees[cex] = parseFloat(cexRow.fee);
        }
    } catch (error) {
        console.log("[Error] Could not read from fees database: " + error)
    } finally {
        return fees;
    }
}
