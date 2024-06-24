import { FilterOptionValue, listToFilter } from "./FilterData";
import { io } from "socket.io-client";

export const socket = io('http://localhost:443');
// export const socket = io('https://cex-checker-8mqk8.ondigitalocean.app/');

export interface PriceQuery {
    inputToken: string;
    outputToken: string;
    amount: number;
    filter: FilterOptionValue[];
    includeFees: boolean;
    isSelling: boolean;
    isArbitrage: boolean;
}

export interface UpdatePriceQuery {
    inputToken?: string;
    outputToken?: string;
    amount?: number; 
    filter?: FilterOptionValue[];
    includeFees?: boolean;
    isSelling?: boolean;
    isArbitrage?: boolean;
}

export type PriceData = {
    [exchange: string]: number | PairStatus;
    binance: number | PairStatus;
    kraken: number | PairStatus;
    coinbase: number | PairStatus;
    crypto_com: number | PairStatus;
    bybit: number | PairStatus;
    jupiter: number | PairStatus;
    oneInch: number | PairStatus;
}

export type ResponseData = {
    prices: PriceData,
    arbitrageSellPrices?: PriceData;
}

export enum PairStatus {
    NoPairFound = "No Pair Found",
    Loading = "Loading"
}

export function getPriceData({ inputToken, outputToken, amount, filter: filterList, includeFees, isSelling, isArbitrage }: PriceQuery) {
    const filterObj = listToFilter(filterList);
    console.log(inputToken, outputToken, amount, filterList, includeFees, isSelling, isArbitrage);
    socket.emit('get-price', { inputToken, outputToken, inputAmount: amount, cexList: filterObj, includeFees, isSelling, isArbitrage })
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

export const initializeResponseObject = () => {
    return {
        prices: {
            binance: PairStatus.Loading,
            kraken: PairStatus.Loading,
            coinbase: PairStatus.Loading,
            crypto_com: PairStatus.Loading,
            bybit: PairStatus.Loading,
            jupiter: PairStatus.Loading,
            oneInch: PairStatus.Loading,
        }
    }
}