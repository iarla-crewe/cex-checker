import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const quoteTokens: { [key: string]: number } = {
  "usdc": 1,
  "usdt": 1,
  "usd": 1,
  "eur": 2,
  "btc": 3,
  "eth": 4,
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
      throw Error("No base token")
  }

  let tokenPair: TokenPair = {
      base: baseToken,
      quote: quoteToken,
  }
  
  return tokenPair
}

export type TokenPair = {
  base: string
  quote: string,
}