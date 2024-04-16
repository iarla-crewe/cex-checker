import { io } from "./socket.js";
import { PriceResponse, Prices } from "./types.js";

let lastEmitTime: number = 0; // Initialize the last emission time

export let currentPrices: Prices = {
    binance: undefined,
    kraken: undefined,
    coinbase: undefined,
    crypto_com: undefined,
    bybit: undefined
};

export const emitPrices = (newPrices: Prices) => { 
    let isChanged = false;

    //check if new prices are different to old ones
    if (newPrices.binance !== undefined && newPrices.binance !== currentPrices.binance) {
        currentPrices.binance = newPrices.binance;
        isChanged = true;
        console.log("New Binance price")
    }
    if (newPrices.kraken !== undefined && newPrices.kraken !== currentPrices.kraken) {
        currentPrices.kraken = newPrices.kraken;
        isChanged = true;
        console.log("New Kraken price")
    }
    if (newPrices.bybit !== undefined && newPrices.bybit !== currentPrices.bybit) {
        currentPrices.bybit = newPrices.bybit;
        isChanged = true;
        console.log("New ByBit price")
    }

    //check that at least one currentPrice is different to the previous prices
    if (isChanged) {

        currentPrices = currentPrices

        // Check if it's been at least 5 seconds since the last emission
        const currentTime = Date.now();
        if (currentTime - lastEmitTime >= 5000) {
            // Update the last emission time
            lastEmitTime = currentTime;
            let priceResponse: PriceResponse = {
                prices: currentPrices
            }
            io.emit('get-price', {priceResponse: priceResponse})
            console.log("emitting new prices: ", currentPrices)
            return
        }
    } 
}
export let tokenAmount = 1;

export const updateTokenAmount = (newAmount: number) => {
    tokenAmount = newAmount;
}

export const calculatePrice = (tokenPrice: string, takerFee: number): number => {
    let price = (Number(tokenPrice) * (1 - takerFee))
    return parseFloat((price * tokenAmount).toFixed(5))
}
