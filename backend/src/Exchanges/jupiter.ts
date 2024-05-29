import { TokenPairPrices } from "../index.js";
import { HttpLoopObj, PairStatus } from "../types.js";
import axios from "axios";

const API_URL = `https://price.jup.ag/v6/price?ids=™&vsToken=†`;

export const openJupiterHttp = (baseToken: string, quoteToken: string) => {
    let intervalId: NodeJS.Timeout;
    let tokenPairString = `${baseToken}/${quoteToken}`
    let price;

    //call the loop
    intervalId = setInterval(async () => {
        price = await getJupiterPriceData(baseToken, quoteToken);

        if (price != undefined) {
            //Store price in object
            TokenPairPrices[tokenPairString].jupiter = price
            console.log("Jupiter Price!: ", price)
        } else {
            TokenPairPrices[tokenPairString].jupiter = PairStatus.NoPairFound;
            console.log("Jupiter - No tokenpair found for: ", tokenPairString);
            //close loop
            clearInterval(intervalId);
        }
    }, 5000);

    const jupiterLoopObj: HttpLoopObj = {
        close: function (): void {
            console.log('Jupiter Http loop closed');
            clearInterval(intervalId);
        }
    }

    //return an object that has the method "close" that will clear interval
    return jupiterLoopObj;
}


export async function getJupiterPriceData(inputToken: string, outputToken: string) {
    try {
        let link = setExchangeLink(API_URL, inputToken, outputToken);
        const response = await axios.get(link);
        let jupPriceObj = response.data.data

        if (Object.keys(jupPriceObj).length === 0) {
            //No pair found
            return undefined;
        } else if (jupPriceObj[inputToken.toUpperCase()]) {
            return jupPriceObj[inputToken.toUpperCase()].price;
        }
        console.log("Jupiter - Options not matched")
        return undefined;
    } catch (error) {
        console.error('Jupiter - Error fetching data:', error);
        return undefined;
    }
}

export function setExchangeLink(link: string, inputToken: string, outputToken: string): string {
    let formattedlink = link
        .replace("™", inputToken.toUpperCase())
        .replace("†", outputToken.toUpperCase())

    return formattedlink;
}