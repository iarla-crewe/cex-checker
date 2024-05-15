import WebSocket from "ws";
import { TokenPairPrices } from "../index.js";
import { PairStatus } from "../types.js";

export const openCoinbaseWs = (baseTokenOriginal: string, quoteTokenOriginal: string) => {
    let btFormatted = baseTokenOriginal
    let qtFormatted = quoteTokenOriginal

    //on coinbase usdc is the same as usd
    if (baseTokenOriginal.toLowerCase() === 'usdc') btFormatted = 'usd'
    if (quoteTokenOriginal.toLowerCase() === 'usdc') qtFormatted = 'usd'

    const coinbaseWebSocketUrl = 'wss://ws-feed.exchange.coinbase.com';

    const coinbaseSocket = new WebSocket(coinbaseWebSocketUrl);

    coinbaseSocket.onopen = () => {
        coinbaseSocket.send(JSON.stringify({
            "type": "subscribe",
            "product_ids": [
                `${btFormatted.toUpperCase()}-${qtFormatted.toUpperCase()}`
            ],
            "channels": [
                "level2",
                "heartbeat",
                {
                    "name": "ticker",
                    "product_ids": [
                        `${btFormatted.toUpperCase()}-${qtFormatted.toUpperCase()}`,
                    ]
                }
            ]
        }))
        console.log("Connecting with coinbase")
    }

    coinbaseSocket.onmessage = ({ data }: any) => {
        let priceObject = JSON.parse(data)
        if (priceObject.type == 'error') {
            if (priceObject.reason.includes("not a valid product")) {
                TokenPairPrices[`${baseTokenOriginal}/${quoteTokenOriginal}`].coinbase = PairStatus.NoPairFound
            }
        } else {
            try {
                let price = parseFloat(priceObject.price)
                if (!Number.isNaN(price)) TokenPairPrices[`${baseTokenOriginal}/${quoteTokenOriginal}`].coinbase = price
            } catch (error) {
                console.log("Coinbase data object does not contain a price", error)
            }
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