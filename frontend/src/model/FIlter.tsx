export interface Filter {
    [exchange: string]: boolean;
    binance: boolean;
    bybit: boolean; 
    coinbase: boolean;
    crypto_com: boolean;
    kraken: boolean;
}

export type FilterOptionValue = [string, boolean]