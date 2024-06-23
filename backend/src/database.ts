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

export async function getFees(tokenA: string, tokenB: string) {
    let feesA: Prices = {
        binance: 0,
        kraken: 0,
        coinbase: 0,
        crypto_com: 0,
        bybit: 0,
        jupiter: 0,
        oneInch: 0
    }
    let feesB: Prices = Object.assign({}, feesA);
    const query = 
        `SELECT 'withdrawal' AS type, e.name AS exchange_name, wf.fee_amount AS fee
        FROM withdrawal_fee wf
        JOIN exchange e ON wf.exchange_id = e.exchange_id
        WHERE wf.token = $1;`;

    try {
        const connection = await pool.connect();
        const resultA = await connection.query(query, [tokenA]);
        const resultB = await connection.query(query, [tokenB]);

        const withdrawalFeesWithTokenA  = resultA.rows.map(obj => ({ ...obj, token: `${tokenA}` }));
        const withdrawalFeesWithTokenB = resultB.rows.map(obj => ({ ...obj, token: `${tokenB}` }));
        const combinedWithdrawalFees = [...withdrawalFeesWithTokenA, ...withdrawalFeesWithTokenB];

        for(const cex in feesA) {
            //@ts-ignore
            let matchingObject = combinedWithdrawalFees.find(obj => obj.exchange_name == cex.name && obj.token == tokenA);
            if (matchingObject) feesA[cex] = matchingObject.fee;

            //@ts-ignore
            matchingObject = combinedWithdrawalFees.find(obj => obj.exchange_name == cex.name && obj.token == tokenB);
            if (matchingObject) feesB[cex] = matchingObject.fee;
        }
    } catch (error) {
        console.log("[Error] Could not read from fees database: " + error)
    } finally {
        return [feesA, feesB];
    }
}
