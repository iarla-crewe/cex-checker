import { ExchangeFees } from "../types.js";

export let exchangeTakerFees: ExchangeFees = {
    binance: 0.001,
    kraken: 0.004,
    coinbase: 0.006,
    crypto_com: 0.00075,
    bybit: 0.001,
    jupiter: 0,
    oneInch: 0,
    backpack: 0.00095,
}

export let exchangeMakerFees: ExchangeFees = {
    binance: 0.001,
    kraken: 0.0024,
    coinbase: 0.004,
    crypto_com: 0.00075,
    bybit: 0.001,
    jupiter: 0,
    oneInch: 0,
    backpack: 0.00085
}