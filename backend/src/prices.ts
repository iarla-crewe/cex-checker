import { io } from "./socket.js";

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

export const sortPrices = (binancePrice: string, krakenPrice: string) => { 

    //sort prices into an object
    let priceOrder: Prices = {
        binance: sortedPrices.binance,
        kraken: sortedPrices.kraken,
        coinbase: "",
        crypto_com: "",
        bybit: ""
    }

    if (binancePrice !== sortedPrices.binance && binancePrice !== undefined && binancePrice !== "NaN") {
        priceOrder.binance = binancePrice
        console.log("New Binance price")
    }
    if (krakenPrice !== sortedPrices.kraken && krakenPrice !== undefined && krakenPrice !== "NaN") {
        priceOrder.kraken = krakenPrice
        console.log("New kraken price")
    }

    if (priceOrder.binance !== sortedPrices.binance || priceOrder.kraken !== sortedPrices.kraken) {
        // Convert the object into an array of key-value pairs
        let priceOrderArray = Object.entries(priceOrder);

        // Sort the array based on the values in descending order
        //@ts-ignore
        priceOrderArray.sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));

        // Convert the sorted array back into an object
        let sortedPriceOrder = Object.fromEntries(priceOrderArray);
        console.log(sortedPriceOrder)

        //@ts-ignore
        sortedPrices = sortedPriceOrder
        io.emit('get-price', {sortedPrices})
    } 
}

export const minusFees = (tokenPrice: string, takerFee: number, tokenAmount: number): string => {
    let price = (Number(tokenPrice) * (1 - takerFee))
    return (price * tokenAmount).toFixed(5)
}