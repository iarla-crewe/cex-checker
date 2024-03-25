import { binancePrice, getBinancePrice } from "./binance.js";
import { getKrakenPrice, krakenPrice } from "./kraken.js";

export const sortPrices = (binancePrice: string, krakenPrice: string) => { 
    //sort prices into an object
    let priceOrder = {
        "Binance": binancePrice,
        "Kraken": krakenPrice,
    }

    // Convert the object into an array of key-value pairs
    let priceOrderArray = Object.entries(priceOrder);

    // Sort the array based on the values in descending order
    //@ts-ignore
    priceOrderArray.sort((a, b) => b[1] - a[1]);

    // Convert the sorted array back into an object
    let sortedPriceOrder = Object.fromEntries(priceOrderArray);

    console.log(sortedPriceOrder);
}

getBinancePrice("sol")
getKrakenPrice("SOL")