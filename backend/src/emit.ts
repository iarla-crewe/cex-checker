import { io } from "./socket.js";
import { Prices, TokenPair } from "./types.js";

let lastEmitTime: number = 0; // Initialize the last emission time

export let currentPrices: Prices = {
    binance: undefined,
    kraken: undefined,
    coinbase: undefined,
    crypto_com: undefined,
    bybit: undefined
};

export let queryChanged = false;

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

        // Check if it's been at least 5 seconds since the last emission or if queryChanged is true
        const currentTime = Date.now();
        if (currentTime - lastEmitTime >= 5000 || queryChanged) {
            // Update the last emission time
            lastEmitTime = currentTime;
            io.emit('get-price', {prices: currentPrices})
            console.log("emitting new prices: ", currentPrices)
            queryChanged = false;
            return
        }
    } 
}
export let tokenAmount = 1;

export const updateTokenAmount = (newAmount: number) => {
    tokenAmount = newAmount;
}

export const updateQueryChanged = () => {
    console.log("Instant update - query changed")
    queryChanged = true;
}

export const calculatePrice = (tokenPrice: string, takerFee: number): number => {
    let price = (Number(tokenPrice) * (1 - takerFee))
    return parseFloat((price * tokenAmount).toFixed(5))
}

export const resetPriceResponse = () => {
    currentPrices.binance = undefined
    currentPrices.bybit = undefined
    currentPrices.coinbase = undefined
    currentPrices.crypto_com = undefined
    currentPrices.kraken = undefined
}

// const calculateOutputAmount = (tokenPair: TokenPair, inputToken: string) => {
//     //get the currenttokenPair
//     //get the current inout token.
//     if (inputToken == tokenPair.quote) {
//         return amount * price
//     }
//     if (inputToken == tokenPair.base) {
//         return amount / price
//     }
// }