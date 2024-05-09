import WebSocket from "ws";
import { TokenPairPrices } from "../index.js";

export const openCrypto_comWs = (baseToken: string, quoteToken: string) => {
    const crypto_comWebSocketUrl = 'wss://stream.crypto.com/v2/market';

    const crypto_comSocket = new WebSocket(crypto_comWebSocketUrl);

    crypto_comSocket.onopen = () => {
        crypto_comSocket.send(JSON.stringify({
            "id": 1,
            "method": "subscribe",
            "params": {
              "channels": [`trade.${baseToken.toUpperCase()}${quoteToken.toUpperCase()}-PERP`]
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
        } else {
            try {
                TokenPairPrices[`${baseToken}/${quoteToken}`].crypto_com = parseFloat(priceObject.result.data[0].p)
                //console.log("new crypto.com price: ", currentPrices.crypto_com)
            } catch (error) {
                console.log("crypto.com data object does not contain a price")
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