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
    backpack: number | PairStatus;
}

// export const newPrices: Prices = {
//     binance: 0,
//     kraken: 0,
//     coinbase: 0,
//     crypto_com: 0,
//     bybit: 0,
//     jupiter: 0,
//     oneInch: 0
// }

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
    backpack: boolean,
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
    backpack: number,
}

export type PriceQuery = {
    inputToken: string,
    outputToken: string,
    inputAmount: number,
    cexList: CexList,
    includeFees: boolean,
    isSelling: boolean,
    isArbitrage: boolean,
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
    backpack?: WebSocket,
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
