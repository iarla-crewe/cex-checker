import { io } from "./socket.js";

let lastEmitTime: number = 0; // Initialize the last emission time

export type Prices = {
    binance: string,
    kraken: string,
    coinbase: string,
    crypto_com: string,
    bybit: string,
}

export let sortedPrices: Prices = {
    binance: "",
    kraken: "",
    coinbase: "",
    crypto_com: "",
    bybit: ""
};

export const sortPrices = (binancePrice: string, krakenPrice: string, bybitPrice: string) => { 

    //sort prices into an object
    let priceOrder: Prices = {
        binance: sortedPrices.binance,
        kraken: sortedPrices.kraken,
        coinbase: "",
        crypto_com: "",
        bybit: sortedPrices.bybit
    }

    if (binancePrice !== sortedPrices.binance && binancePrice !== undefined && binancePrice !== "NaN") {
        priceOrder.binance = binancePrice
        console.log("New Binance price")
    }
    if (krakenPrice !== sortedPrices.kraken && krakenPrice !== undefined && krakenPrice !== "NaN") {
        priceOrder.kraken = krakenPrice
        console.log("New kraken price")
    }

    if (bybitPrice !== sortedPrices.bybit && bybitPrice !== undefined && bybitPrice !== "NaN") {
        priceOrder.bybit = bybitPrice
        console.log("New bybit price")
    }

    if (priceOrder.binance !== sortedPrices.binance || priceOrder.kraken !== sortedPrices.kraken || priceOrder.bybit !== sortedPrices.bybit) {
        // Convert the object into an array of key-value pairs
        console.log("price order", priceOrder)

        let priceOrderArray = Object.entries(priceOrder);

        // Sort the array based on the values in descending order
        //@ts-ignore
        priceOrderArray.sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));

        // Convert the sorted array back into an object
        let sortedPriceOrder = Object.fromEntries(priceOrderArray);
        console.log(sortedPriceOrder)

        //@ts-ignore
        sortedPrices = sortedPriceOrder

        // Check if it's been at least 5 seconds since the last emission
        const currentTime = Date.now();
        if (currentTime - lastEmitTime >= 5000) {
            // Update the last emission time
            lastEmitTime = currentTime;
            io.emit('get-price', {sortedPrices})
            return
        }
    } 
}

export const minusFees = (tokenPrice: string, takerFee: number, tokenAmount: number): string => {
    let price = (Number(tokenPrice) * (1 - takerFee))
    return (price * tokenAmount).toFixed(5)
}