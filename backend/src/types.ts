import WebSocket from "ws";

export type Prices = {
    [exchange: string]: number | undefined;
    binance?: number;
    kraken?: number;
    coinbase?: number;
    crypto_com?: number;
    bybit?: number;
}

export type CexList = {
    binance: boolean,
    kraken: boolean,
    coinbase: boolean,
    crypto_com: boolean,
    bybit: boolean,
}

export type ExchangeFees = {
    [exchange: string]: number | undefined;
    binance: number,
    kraken: number,
    coinbase: number,
    crypto_com: number,
    bybit: number,
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

export type WsConnections = {
    [exchange: string]: WebSocket | undefined;
    binance?: WebSocket,
    kraken?: WebSocket,
    coinbase?: WebSocket,
    crypto_com?: WebSocket,
    bybit?: WebSocket,
}

export type TokenPairConnections = {
    [tokenPair: string]: WsConnections | undefined;
}

export type TradingPairPrices = {
    [tokenPair: string]: Prices
}
