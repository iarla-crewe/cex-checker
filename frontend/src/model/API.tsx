import { Filter } from "./FIlter";
import { io } from "socket.io-client";

export const socket = io('https://cex-checker-8mqk8.ondigitalocean.app/')
//export const socket = io('http://localhost:443')

export interface PriceQuery {
    inputToken: string;
    outputToken: string;
    amount: number;
    filter: Filter;
}

export interface UpdatePriceQuery {
    inputToken?: string;
    outputToken?: string;
    amount?: number; 
    filter?: Filter;
}

export interface ResponseData {
    [exchange: string]: number | undefined;
    binance?: number;
    bybit?: number;
    coinbase?: number;
    crypto_com?: number;
    kraken?: number;
}

export function getPriceData({ inputToken, outputToken, amount, filter }: PriceQuery) {
    socket.emit('get-price', { inputToken, outputToken, inputAmount: amount, cexList: filter })
}

export async function getFeeData(tokenA: string, tokenB: string) {

    let depositFees = await fetch('/api/deposit-fee', {
        method: 'POST',
        body: JSON.stringify({
            tokenA: tokenA,
            tokenB: tokenB
        })
    })

    let withdrawalFees = await fetch('/api/withdrawal-fee', {
        method: 'POST',
        body: JSON.stringify({
            tokenA: tokenA,
            tokenB: tokenB
        })
    })

    let depositFeeObj = await depositFees.json()
    let withdrawalFeeObj = await withdrawalFees.json()

    return [depositFeeObj, withdrawalFeeObj]
}