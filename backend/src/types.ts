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
    quote: string,
    base: string
}