import { io } from "./socket.js";

let lastEmitTime: number = 0; // Initialize the last emission time

export interface PriceData {
    price: number;
    inputWithdrawFee: number;
    outputWithdrawFee: number;
}

export interface Prices {
    binance?: PriceData,
    kraken?: PriceData,
    coinbase?: PriceData,
    crypto_com?: PriceData,
    bybit?: PriceData,
}

export let prices: Prices = {};

export const sortPrices = (binancePrice: string, krakenPrice: string, bybitPrice: string) => { 

    //sort prices into an object
    let priceOrder: Prices = {
        binance: prices.binance,
        kraken: prices.kraken,
        bybit: prices.bybit
    }

    if (prices.binance !== undefined && binancePrice !== undefined && binancePrice !== "NaN" && parseFloat(binancePrice) !== prices.binance.price) {
        priceOrder.binance = {price: parseFloat(binancePrice), inputWithdrawFee: 0 , outputWithdrawFee: 0}
        console.log("New Binance price")
    }
    if (prices.kraken !== undefined && krakenPrice !== undefined && krakenPrice !== "NaN" && parseFloat(krakenPrice) !== prices.kraken.price) {
        priceOrder.kraken = {price: parseFloat(krakenPrice), inputWithdrawFee: 0 , outputWithdrawFee: 0}
        console.log("New Kraken price")
    }
    if (prices.bybit !== undefined && bybitPrice !== undefined && bybitPrice !== "NaN" && parseFloat(bybitPrice) !== prices.bybit.price) {
        priceOrder.bybit = {price: parseFloat(bybitPrice), inputWithdrawFee: 0 , outputWithdrawFee: 0}
        console.log("New ByBit price")
    }

    if (priceOrder.binance !== prices.binance || priceOrder.kraken !== prices.kraken || priceOrder.bybit !== prices.bybit) {

        // Check if it's been at least 5 seconds since the last emission
        const currentTime = Date.now();
        if (currentTime - lastEmitTime >= 5000) {
            // Update the last emission time
            lastEmitTime = currentTime;
            io.emit('get-price', {prices})
            console.log("emitting sorted prices: ", prices)
            return
        }
    } 
}

export const minusFees = (tokenPrice: string, takerFee: number, tokenAmount: number): string => {
    let price = (Number(tokenPrice) * (1 - takerFee))
    return (price * tokenAmount).toFixed(5)
}