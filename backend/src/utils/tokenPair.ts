import { PriceQuery, Prices, TokenPair } from "../types.js";

//find the basetoken for between input token and output token
const quoteTokens: { [key: string]: number } = {
    "usdt": 1,
    "usdc": 1,
    "usd": 3,
    "eur": 4,
    "btc": 5,
    "eth": 6,
}

export const getTokenPair = (input: string, output: string) => {
    input = input.toLowerCase()
    output = output.toLowerCase()
    let baseToken: string = "";
    let quoteToken: string = "";

    if (quoteTokens.hasOwnProperty(input) && !quoteTokens.hasOwnProperty(output)) {
        quoteToken = input
        baseToken = output
    }
    if (!quoteTokens.hasOwnProperty(input) && quoteTokens.hasOwnProperty(output)) {
        baseToken = input
        quoteToken = output
    }

    if (quoteTokens.hasOwnProperty(input) && quoteTokens.hasOwnProperty(output)) {
        const inputTokenValue = quoteTokens[input];
        const outputTokenValue = quoteTokens[output];

        if (inputTokenValue < outputTokenValue) {
            quoteToken = input
            baseToken = output
        } else if (outputTokenValue < inputTokenValue) {
            baseToken = input
            quoteToken = output
        } else {
            quoteToken = output
            baseToken = input
        }
    }

    if (!quoteTokens.hasOwnProperty(input) && !quoteTokens.hasOwnProperty(output)) {
        //neither is a quote token
        baseToken = input
        quoteToken = output
    }

    let tokenPair: TokenPair = {
        base: baseToken,
        quote: quoteToken,
    }

    return tokenPair
}

export const tokensFlipped = (previousQuery: PriceQuery, newQuery: PriceQuery) => {
    if (previousQuery.inputToken == newQuery.outputToken && previousQuery.outputToken == newQuery.inputToken) return true
    return false
}

export const convertWithdrawFees = (fees: Prices, price: number) => {
    return 0;
}
