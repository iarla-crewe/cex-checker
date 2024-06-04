import WebSocket from "ws";
import { TokenPairPrices } from "../index.js";
import { PairStatus } from "../types.js";
import axios from "axios";

export const openBinanceWs = (baseToken: string, quoteToken: string, flipped?: boolean) => {
    const binanceWebSocketUrl = `wss://stream.binance.com:9443/ws/${baseToken + quoteToken}@trade`;

    const binanceSocket = new WebSocket(binanceWebSocketUrl);

    let isLoading = true;
    let foundPrice = false;
    if (flipped == undefined) flipped = false;
    let tokenPairString = `${baseToken}/${quoteToken}`
    if (flipped) tokenPairString = `${quoteToken}/${baseToken}`

    binanceSocket.onopen = () => {
        binanceSocket.send(JSON.stringify({
            "method": "SUBSCRIBE",
            "params":
                [
                    `${baseToken + quoteToken}@trade`,
                ],
            "id": 1
        }))
        console.log("Connecting with binance")

        setTimeout(() => {
            isLoading = false;
            if ((baseToken == "eur" || quoteToken == "eur") && !flipped && !foundPrice) {
                //flip tokens and retry the connection.
                console.log("Flipping binance token pair")
                console.log("Token pair string binance: ", tokenPairString)
                return openBinanceWs(quoteToken, baseToken, true);
            } else {
                if (!foundPrice) {
                    TokenPairPrices[tokenPairString].binance = PairStatus.NoPairFound
                }
            }
        }, 30000);
    }

    binanceSocket.onmessage = ({ data }: any) => {
        let priceObject = JSON.parse(data)

        if (priceObject.s != `${baseToken.toUpperCase() + quoteToken.toUpperCase()}` && !isLoading) {

            if ((baseToken == "eur" || quoteToken == "eur") && !flipped) {
                //flip tokens and retry the connection.
                console.log("Flipping binance token pair")
                return openBinanceWs(quoteToken, baseToken, true);
            } else {
                TokenPairPrices[tokenPairString].binance = PairStatus.NoPairFound
            }
        } else {
            if (!Number.isNaN(parseFloat(priceObject.p))) {
                let price = parseFloat(priceObject.p);
                if (flipped) {
                    price = 1 / price;
                }
                TokenPairPrices[tokenPairString].binance = price
                foundPrice = true;
            } else {
                TokenPairPrices[tokenPairString].binance = PairStatus.Loading
            }
        }
    };

    binanceSocket.on('close', (code: number, reason: string) => {
        console.log(`Binance webSocket connection closed, code: ${code}, reason: ${reason}`);
    });

    binanceSocket.on('error', (error: Error) => {
        console.error('Binance webSocket error:', error.message);
    });

    return binanceSocket;
}

const API_URL = "https://data-api.binance.vision/api/v3/ticker/price"

export const getCurrentBinancePrice = async (baseToken: string, quoteToken: string) => {
    let tokenPairString = `${baseToken}/${quoteToken}`

    const config = {
        params: {
            symbol: `${baseToken.toUpperCase()}${quoteToken.toUpperCase()}`,
        }
    };
    let response;
    try {
        response = await axios.get(API_URL, config);
    } catch (error) {
        //@ts-ignore
        console.log("binance api call error", error.response.data)
        TokenPairPrices[tokenPairString].binance = PairStatus.NoPairFound
        return
    }
    let price = Number(response!.data.price);
    console.log("Binance Price from api call: ", price);

    TokenPairPrices[tokenPairString].binance = price
    return;
}