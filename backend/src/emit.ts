import { io } from "./socket.js";
import { PriceResponse, Prices } from "./types.js";

let lastEmitTime: number = 0; // Initialize the last emission time

export let previousPrices: Prices = {
    binance: "",
    kraken: "",
    coinbase: "",
    crypto_com: "",
    bybit: ""
};

export const emitPrices = (newPrices: Prices) => { 

    //sort prices into an object
    let currentPrices: Prices = {
        binance: previousPrices.binance,
        kraken: previousPrices.kraken,
        coinbase: "",
        crypto_com: "",
        bybit: previousPrices.bybit
    }
    //check if new prices are different to old ones
    if (newPrices.binance !== previousPrices.binance && newPrices.binance !== undefined && newPrices.binance !== "NaN") {
        currentPrices.binance = newPrices.binance
        console.log("New Binance price")
    }
    if (newPrices.kraken !== previousPrices.kraken && newPrices.kraken !== undefined && newPrices.kraken !== "NaN") {
        currentPrices.kraken = newPrices.kraken
        console.log("New kraken price")
    }

    if (newPrices.bybit !== previousPrices.bybit && newPrices.bybit !== undefined && newPrices.bybit !== "NaN") {
        currentPrices.bybit = newPrices.bybit
        console.log("New bybit price")
    }
    //check that at least one currentPrice is different to the previous prices
    if (currentPrices.binance !== previousPrices.binance || currentPrices.kraken !== previousPrices.kraken || currentPrices.bybit !== previousPrices.bybit) {

        previousPrices = currentPrices

        // Check if it's been at least 5 seconds since the last emission
        const currentTime = Date.now();
        if (currentTime - lastEmitTime >= 5000) {
            // Update the last emission time
            lastEmitTime = currentTime;
            let priceResponse: PriceResponse = {
                prices: previousPrices
            }
            io.emit('get-price', {priceResponse: priceResponse})
            console.log("emitting new prices: ", previousPrices)
            return
        }
    } 
}
export let tokenAmount = 1;

export const updateTokenAmount = (newAmount: number) => {
    tokenAmount = newAmount;
}

export const calculatePrice = (tokenPrice: string, takerFee: number): string => {
    let price = (Number(tokenPrice) * (1 - takerFee))
    return (price * tokenAmount).toFixed(5)
}