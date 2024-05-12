export interface Filter {
    [exchange: string]: boolean;
    binance: boolean;
    kraken: boolean;
    coinbase: boolean;
    crypto_com: boolean;
    bybit: boolean;
}

export type FilterOptionValue = [string, boolean]