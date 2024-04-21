import { exchangeTakerFees } from "./CEXs/prices.js";
import { io, previousImportToken, previousTokenPair } from "./index.js";
import { ExchangeFees, Prices, TokenPair } from "./types.js";

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
        // Check if it's been at least 5 seconds since the last emission or if queryChanged is true
        const currentTime = Date.now();
        if (currentTime - lastEmitTime >= 5000 || queryChanged) {
            // Update the last emission time
            lastEmitTime = currentTime;
            let pricesToEmit = calculatePrices(currentPrices, exchangeTakerFees, tokenAmount)
            io.emit('get-price', {prices: pricesToEmit})
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

export const calculatePrices = (tokenPrices: Prices, takerFees: ExchangeFees, amount: number): Prices => {
    const calculatedPrices: Prices = {};
    let inputIsQuote = checkIfInputIsQuote(previousTokenPair, previousImportToken)
    
    for (const exchange in tokenPrices) {
        if (tokenPrices.hasOwnProperty(exchange)) {
            const tokenPrice = tokenPrices[exchange];
            const takerFee = takerFees[exchange];

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