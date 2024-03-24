import { getBinancePrice } from "./binance.js";
import { getKrakenPrice } from "./kraken.js";

let binancePrice = getBinancePrice("sol")
let krakenPrice = getKrakenPrice("SOL")