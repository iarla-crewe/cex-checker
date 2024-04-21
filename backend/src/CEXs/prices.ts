import { ExchangeFees } from "../types.js";

export let exchangeTakerFees: ExchangeFees = {
    binance: 0.001,
    kraken: 0.004,
    coinbase: 0,
    crypto_com: 0,
    bybit: 0.001
}

export let exchangeMakerFees: ExchangeFees = {
    binance: 0.001,
    kraken: 0.0024,
    coinbase: 0,
    crypto_com: 0,
    bybit: 0.001
}