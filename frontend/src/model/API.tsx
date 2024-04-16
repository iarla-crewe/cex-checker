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

export interface ResponseData {
    [exchange: string]: CEXPriceData | undefined;
    binance?: CEXPriceData;
    bybit?: CEXPriceData;
    coinbase?: CEXPriceData;
    crypto_com?: CEXPriceData;
    kraken?: CEXPriceData;
}

export interface CEXPriceData {
    price: number;
    inputWithdrawFee: number;
    outputWithdrawFee: number;
}

export function getPriceData({ inputToken, outputToken, amount, filter }: PriceQuery) {
    socket.emit('get-price', { inputToken, outputToken, inputAmount: amount, cexList: filter })
}
