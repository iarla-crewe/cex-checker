import WebSocket from "ws";
import { TokenPairPrices } from "../index.js";

export const openCoinbaseWs = (baseToken: string, quoteToken: string) => {
    const coinbaseWebSocketUrl = 'wss://ws-feed.exchange.coinbase.com';

    const coinbaseSocket = new WebSocket(coinbaseWebSocketUrl);

    coinbaseSocket.onopen = () => {
        coinbaseSocket.send(JSON.stringify({
            "type": "subscribe",
            "product_ids": [
                `${baseToken.toUpperCase()}-${quoteToken.toUpperCase()}`
            ],
            "channels": [
                "level2",
                "heartbeat",
                {
                    "name": "ticker",
                    "product_ids": [
                        `${baseToken.toUpperCase()}-${quoteToken.toUpperCase()}`,
                    ]
                }
            ]
        }))
        console.log("Connecting with coinbase")
    }

    coinbaseSocket.onmessage = ({ data }: any) => {
        let priceObject = JSON.parse(data)
        try {
            let price = parseFloat(priceObject.price)
            if (!Number.isNaN(price)) TokenPairPrices[`${baseToken}/${quoteToken}`].coinbase = price
        } catch (error) {
            console.log("Coinbase data object does not contain a price")
        }
    };

    coinbaseSocket.on('close', (code: number, reason: string) => {
        console.log(`Coinbase webSocket connection closed, code: ${code}, reason: ${reason}`);
    });

    coinbaseSocket.on('error', (error: Error) => {
        console.error('Coinbase webSocket error:', error.message);
    });

    return coinbaseSocket;
}