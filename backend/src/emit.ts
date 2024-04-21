import { exchangeTakerFees } from "./CEXs/prices.js";
import { Prices, TokenPair } from "./types.js";

let lastEmitTime: number = 0; // Initialize the last emission time

export let currentPrices: Prices = {
    binance: undefined,
    kraken: undefined,
    coinbase: undefined,
    crypto_com: undefined,
    bybit: undefined
};

let previousPrices: Prices = {
    binance: undefined,
    kraken: undefined,
    coinbase: undefined,
    crypto_com: undefined,
    bybit: undefined
};

// export let queryChanged = false;

export const isNewReponse = (queryChanged: boolean) => { 
    let isChanged = false;

    //check if new prices are different to old ones
    if (previousPrices.binance !== undefined && previousPrices.binance !== currentPrices.binance) {
        currentPrices.binance = previousPrices.binance;
        isChanged = true;
        console.log("New Binance price")
    }
    if (previousPrices.kraken !== undefined && previousPrices.kraken !== currentPrices.kraken) {
        currentPrices.kraken = previousPrices.kraken;
        isChanged = true;
        console.log("New Kraken price")
    }
    if (previousPrices.bybit !== undefined && previousPrices.bybit !== currentPrices.bybit) {
        currentPrices.bybit = previousPrices.bybit;
        isChanged = true;
        console.log("New ByBit price")
    }

    //check that at least one currentPrice is different to the previous prices
    if (isChanged || queryChanged) {
        previousPrices = currentPrices
        return true;
    }
    return false
}

export const calculatePrices = (tokenPrices: Prices, amount: number, inputToken: string, tokenPair: TokenPair): Prices => {
    const calculatedPrices: Prices = {};
    let inputIsQuote = checkIfInputIsQuote(tokenPair, inputToken)
    
    for (const exchange in tokenPrices) {
        if (tokenPrices.hasOwnProperty(exchange)) {
            const tokenPrice = tokenPrices[exchange];
            const takerFee = exchangeTakerFees[exchange];

            // Check if both token price and taker fee are defined for the current exchange
            if (typeof tokenPrice === 'number' && typeof takerFee === 'number') {
                let price = calculateOutputAmount(amount, tokenPrice, inputIsQuote)
                price = price * (1 - takerFee);
                calculatedPrices[exchange] = parseFloat(price.toFixed(5));
            } else {
                calculatedPrices[exchange] = undefined
            }
        }
    }

    return calculatedPrices;
}

export const resetPriceResponse = () => {
    currentPrices.binance = undefined
    currentPrices.bybit = undefined
    currentPrices.coinbase = undefined
    currentPrices.crypto_com = undefined
    currentPrices.kraken = undefined
}

const calculateOutputAmount = (tokenAmount: number, tokenPrice: number, inputIsQuote: boolean) => {
    if (inputIsQuote) return tokenAmount * tokenPrice
    return tokenAmount / tokenPrice
}

const checkIfInputIsQuote = (tokenPair: TokenPair, inputToken: string) => {
    if (inputToken.toLowerCase() == tokenPair.quote) return true;
    return false
}