import { Filter } from "./FIlter";
import { io } from "socket.io-client";

export const socket = io('http://localhost:3001')

export interface PriceQuery {
    inputToken: string;
    outputToken: string;
    amount: number;
    filter: Filter;
}

export interface QueryUpdateData {
    inputToken?: string;
    outputToken?: string;
    amount?: number; 
    filter?: Filter;
}

export function getPriceData({ inputToken, outputToken, amount, filter }: PriceQuery) {
    console.log("get price data")
    socket.emit('get-price', { inputToken, outputToken, inputAmount: amount, cexList: filter })
}
