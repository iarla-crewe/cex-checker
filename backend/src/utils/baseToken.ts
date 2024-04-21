import { PriceQuery, TokenPair } from "../types.js";

//find the basetoken for between input token and output token
const baseTokens: { [key: string]: number } = {
    "usdc": 1,
    "usdt": 1,
    "eur": 2,
    "btc": 3,
    "eth": 4,
}

export const getBaseToken = (input: string, output: string) => {
    input = input.toLowerCase()
    output = output.toLowerCase()
    let quoteToken: string = "";
    let baseToken: string = "";

    if (baseTokens.hasOwnProperty(input) && !baseTokens.hasOwnProperty(output)) {
        quoteToken = output
        baseToken = input
    }
    if (!baseTokens.hasOwnProperty(input) && baseTokens.hasOwnProperty(output)) {
        quoteToken = input
        baseToken = output
    }

    if (baseTokens.hasOwnProperty(input) && baseTokens.hasOwnProperty(output)) {
        const inputTokenValue = baseTokens[input];
        const outputTokenValue = baseTokens[output];

        if (inputTokenValue < outputTokenValue) {
            quoteToken = output
            baseToken = input
        } else if (outputTokenValue < inputTokenValue) {
            quoteToken = input
            baseToken = output
        } else {
            quoteToken = output
            baseToken = input
        }
    }

    if (!baseTokens.hasOwnProperty(input) && !baseTokens.hasOwnProperty(output)) {
        throw Error("No base token")
    }

    let tokenPair: TokenPair = {
        quote: quoteToken,
        base: baseToken
    }

    return tokenPair
}

export const tokensFlipped = (previousQuery: PriceQuery, newQuery: PriceQuery) => {
    if (previousQuery.inputToken == newQuery.outputToken && previousQuery.outputToken == newQuery.inputToken) return true
    return false
}