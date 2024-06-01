import WebSocket from "ws";

export type Prices = {
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

export type CexList = {
    binance: boolean,
    kraken: boolean,
    coinbase: boolean,
    crypto_com: boolean,
    bybit: boolean,
    jupiter: boolean,
    oneInch: boolean,
}

export type ExchangeFees = {
    [exchange: string]: number | undefined;
    binance: number,
    kraken: number,
    coinbase: number,
    crypto_com: number,
    bybit: number,
    jupiter: number,
    oneInch: number,
}

export type PriceQuery = {
    inputToken: string,
    outputToken: string,
    inputAmount: number,
    cexList: CexList
}

export type TokenPair = {
    base: string
    quote: string,
}

export type ConnectionsNumber = {
    [key: string]: number;
}

export type ExConnections = {
    [exchange: string]: WebSocket | HttpLoopObj | undefined;
    binance?: WebSocket,
    kraken?: WebSocket,
    coinbase?: WebSocket,
    crypto_com?: WebSocket,
    bybit?: WebSocket,
    jupiter?: HttpLoopObj,
    oneInch?: HttpLoopObj,
}

export type TokenPairConnections = {
    [tokenPair: string]: ExConnections | undefined;
}

export type TradingPairPrices = {
    [tokenPair: string]: Prices
}

export interface HttpLoopObj {
    // Method to handle Http Loop close event
    close(): void;
}
