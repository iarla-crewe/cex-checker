import { FilterOptionValue, listToFilter } from "./FilterData";
import { io } from "socket.io-client";
import * as dotenv from "dotenv";

dotenv.config();
const DEV_BUILD = process.env.DEV_BUILD;
export const socket = (DEV_BUILD === "true") ? io('http://localhost:443') : io('https://cex-checker-8mqk8.ondigitalocean.app/');

export interface PriceQuery {
    inputToken: string;
    outputToken: string;
    amount: number;
    filter: FilterOptionValue[];
    includeFees: boolean;
    isSelling: boolean;
}

export interface UpdatePriceQuery {
    inputToken?: string;
    outputToken?: string;
    amount?: number; 
    filter?: FilterOptionValue[];
    includeFees?: boolean;
    isSelling?: boolean;
}

export type ResponseData = {
    [exchange: string]: number | PairStatus;
    binance: number | PairStatus;
    kraken: number | PairStatus;
    coinbase: number | PairStatus;
    crypto_com: number | PairStatus;
    bybit: number | PairStatus;
    jupiter: number | PairStatus;
    oneInch: number | PairStatus;
}

export enum PairStatus {
    NoPairFound = "No Pair Found",
    Loading = "Loading"
}

export function getPriceData({ inputToken, outputToken, amount, filter: filterList, includeFees, isSelling }: PriceQuery) {
    const filterObj = listToFilter(filterList);
    console.log(inputToken, outputToken, amount, filterObj, includeFees, isSelling);
    socket.emit('get-price', { inputToken, outputToken, inputAmount: amount, cexList: filterObj, includeFees, isSelling })
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

export const initializeRespobseObject = () => {
    return {
        binance: PairStatus.Loading,
        kraken: PairStatus.Loading,
        coinbase: PairStatus.Loading,
        crypto_com: PairStatus.Loading,
        bybit: PairStatus.Loading,
        jupiter: PairStatus.Loading,
        oneInch: PairStatus.Loading,
    }
}