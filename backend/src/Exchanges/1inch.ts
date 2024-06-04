import axios from "axios";
import { TokenPairPrices } from "../index.js";
import { HttpLoopObj, PairStatus } from "../types.js";
import * as dotenv from 'dotenv';

dotenv.config();

export type TokenAddress = {
  [token: string]: TokenInfo | undefined;
}

export type TokenInfo = {
  address: string,
  decimals: number,
}

const tokenAddresses: TokenAddress = {
  usdc: {
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    decimals: 6,
  },
  usdt: {
    address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    decimals: 6,
  },
  btc: {
    address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    decimals: 8,
  },
  eth: {
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    decimals: 18,
  },
  eur: undefined,
  xrp: undefined,
  doge: undefined,
  ada: undefined,
  avax: undefined,
  shib: undefined,
  sol: undefined,
}

const API_URL = "https://api.1inch.dev/swap/v6.0/42161/quote";


export const openOneInchHttp = (baseToken: string, quoteToken: string) => {
  let intervalId: NodeJS.Timeout;
  let tokenPairString = `${baseToken}/${quoteToken}`
  let price;

  //call the loop
  intervalId = setInterval(async () => {
    price = await getOneInchPriceData(baseToken, quoteToken);

    if (price != undefined) {
      //Store price in object
      TokenPairPrices[tokenPairString].oneInch = price
    } else {
      TokenPairPrices[tokenPairString].oneInch = PairStatus.NoPairFound;
      //close loop
      clearInterval(intervalId);
    }
  }, 25000);

  const OneInchLoopObj: HttpLoopObj = {
    close: function (): void {
      console.log('1inch Http loop closed');
      clearInterval(intervalId);
    }
  }

  //return an object that has the method "close" that will clear interval
  return OneInchLoopObj;
}


async function getOneInchPriceData(inputToken: string, outputToken: string): Promise<number | undefined> {
  try {
    let inputAddress = tokenAddresses[inputToken]?.address
    let inputDecimals = tokenAddresses[inputToken]?.decimals
    let outputAddress = tokenAddresses[outputToken]?.address

    if (inputAddress == undefined || inputDecimals == undefined || outputAddress == undefined) {
      console.log("1inch No token pair found")
      return undefined
    }

    let amount = 10 ** inputDecimals!

    const config = {
      headers: {
        "Authorization": `Bearer ${process.env.ONE_INCH_APIKEY}`
      },
      params: {
        "src": inputAddress,
        "dst": outputAddress,
        "amount": `${amount}`,
        "includeTokensInfo": "true",
        "includeGas": "true"
      }
    };

    const response = await axios.get(API_URL, config);
    let oneInchPriceObj = response.data

    try {
      let price = formatNumber(oneInchPriceObj.dstAmount, oneInchPriceObj.dstToken.decimals);
      console.log("1inch Price from api call: ", price)
      return Number(price)
    } catch (error) {
      console.log("1inch Price error when formatting: ", error)
      //No pair found
      return undefined;
    }
  } catch (error) {
    console.error('1inch - Error fetching data:', error);
    return undefined;
  }
}

function formatNumber(number: number, decimals: number) {
  const factor = Math.pow(10, decimals);
  const formattedNumber = (number / factor).toFixed(decimals);
  return formattedNumber;
}

export const getCurrentOneInchPrice = async (baseToken: string, quoteToken: string) => {
  let tokenPairString = `${baseToken}/${quoteToken}`
  const price = await getOneInchPriceData(baseToken, quoteToken);

  if (price != undefined) {
    //Store price in object
    TokenPairPrices[tokenPairString].oneInch = price
  } else {
    TokenPairPrices[tokenPairString].oneInch = PairStatus.NoPairFound;
  }
}