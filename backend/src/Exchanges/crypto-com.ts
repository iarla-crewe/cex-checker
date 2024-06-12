import WebSocket from "ws";
import { TokenPairPrices } from "../index.js";
import { PairStatus } from "../types.js";
import axios from "axios";

export const openCrypto_comWs = (baseToken: string, quoteToken: string) => {
    const crypto_comWebSocketUrl = 'wss://stream.crypto.com/v2/market';

    const crypto_comSocket = new WebSocket(crypto_comWebSocketUrl);

    crypto_comSocket.onopen = () => {
        crypto_comSocket.send(JSON.stringify({
            "id": 1,
            "method": "subscribe",
            "params": {
              "channels": [`trade.${baseToken.toUpperCase()}_${quoteToken.toUpperCase()}`]
            }
          }))
        console.log("Connecting with crypto.com for pair: ", baseToken.toUpperCase(), quoteToken.toUpperCase())
    }

    crypto_comSocket.onmessage = ({ data }: any) => {
        let priceObject = JSON.parse(data)
        if (priceObject.method == "public/heartbeat") {
            crypto_comSocket.send(JSON.stringify({
                "id": priceObject.id,
                "method": "public/respond-heartbeat"
            }))
        } else if (priceObject.message == 'Unknown symbol' || priceObject.result == undefined) {
            TokenPairPrices[`${baseToken}/${quoteToken}`].crypto_com = PairStatus.NoPairFound
        } else {
            try {
                TokenPairPrices[`${baseToken}/${quoteToken}`].crypto_com = parseFloat(priceObject.result.data[0].p)
            } catch (error) {
                console.log("crypto.com data object does not contain a price:", priceObject, "error: ", error)
            }
        }
    };

    crypto_comSocket.on('close', (code: number, reason: string) => {
        console.log(`crypto.com webSocket connection closed, code: ${code}, reason: ${reason}`);
    });

    crypto_comSocket.on('error', (error: Error) => {
        console.error('crypto.com webSocket error:', error.message);
    });

    return crypto_comSocket;
}

export const getCurrentCrypto_comPrice = async (baseToken: string, quoteToken: string) => {
    let tokenPairString = `${baseToken}/${quoteToken}`
    const API_URL = `https://api.crypto.com/v2/public/get-ticker?instrument_name=${baseToken.toUpperCase()}_${quoteToken.toUpperCase()}`;

    let response;
    try {
        response = await axios.get(API_URL);
    } catch (error) {
        console.log("Crypto.com api call error, no token pair found")
        TokenPairPrices[tokenPairString].crypto_com = PairStatus.NoPairFound
        return
    }
    let price: number;
    try {
        price = Number(response.data.result.data[0].a);
    } catch (error) {
        console.log("error calling crypto.com price api: ")
        //console.log("error: ", error)
        TokenPairPrices[tokenPairString].crypto_com = PairStatus.NoPairFound
        return
    }
    console.log("Crypto.com Price from api call: ", price);
    TokenPairPrices[tokenPairString].crypto_com = price
    return
}