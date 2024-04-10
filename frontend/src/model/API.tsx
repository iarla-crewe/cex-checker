import { Filter } from "./FIlter";
import { io } from "socket.io-client";

export const socket = io('http://localhost:3001')

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

export interface PriceData {
    [exchange: string]: string;
    binance: string;
    bybit: string;
    coinbase: string;
    crypto_com: string;
    kraken: string;
}

export function getPriceData({ inputToken, outputToken, amount, filter }: PriceQuery) {
    socket.emit('get-price', { inputToken, outputToken, inputAmount: amount, cexList: filter })
}
