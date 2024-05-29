import { exchangeTakerFees } from "./Exchanges/prices.js";
import { PreviousPrices, TokenPairPrices } from "./index.js";
import { Prices, TokenPair } from "./types.js";
import { initializePriceObject } from "./utils/connections.js";

const exchanges = ['binance', 'bybit', 'coinbase', 'crypto_com', 'kraken'];

export const isNewReponse = (queryChanged: boolean, tokenPairString: string) => {
    let currentPrices = TokenPairPrices[tokenPairString];
    let previousPrices = PreviousPrices[tokenPairString]

    let pricesChanged = false

    // //check if new prices are different to old ones
    for (const exchange of exchanges) {
        if (currentPrices[exchange] !== undefined && previousPrices[exchange] !== currentPrices[exchange]) {
            console.log(`New ${exchange} price, old price: ${previousPrices[exchange]}, new price: ${currentPrices[exchange]}`);
            previousPrices[exchange] = currentPrices[exchange];
            pricesChanged = true;
        }
    }

    if (pricesChanged || queryChanged) {
        return true;
    }
    return false
}

export const calculatePrices = (tokenPrices: Prices, amount: number, inputToken: string, tokenPair: TokenPair): Prices => {
    const calculatedPrices: Prices = initializePriceObject();
    let inputIsBase = checkIfInputIsBase(tokenPair, inputToken)

    for (const exchange in tokenPrices) {
        if (tokenPrices.hasOwnProperty(exchange)) {
            const tokenPrice = tokenPrices[exchange];
            const takerFee = exchangeTakerFees[exchange];

            // Check if both token price and taker fee are defined for the current exchange
            if (typeof tokenPrice === 'number' && typeof takerFee === 'number') {
                let price = calculateOutputAmount(amount, tokenPrice, inputIsBase)
                price = price * (1 - takerFee);
                calculatedPrices[exchange] = parseFloat(price.toFixed(5));
            } else {
                calculatedPrices[exchange] = tokenPrice // tokenprice is either Not found or Loading
            }
        }
    }

    return calculatedPrices;
}

export const resetPriceResponse = (tokenPairString: string) => {
    let currentPrices = TokenPairPrices[tokenPairString]
    currentPrices = initializePriceObject()
}

const calculateOutputAmount = (tokenAmount: number, tokenPrice: number, inputIsBase: boolean) => {
    if (inputIsBase) return tokenAmount * tokenPrice
    return tokenAmount / tokenPrice
}

const checkIfInputIsBase = (tokenPair: TokenPair, inputToken: string) => {
    if (inputToken.toLowerCase() == tokenPair.base) return true;
    return false
}