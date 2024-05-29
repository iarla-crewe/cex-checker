import WebSocket from "ws";
import { TokenPairPrices } from "../index.js";
import { PairStatus } from "../types.js";

export const openCoinbaseWs = (baseTokenOriginal: string, quoteTokenOriginal: string, flipped?: boolean) => {
    let btFormatted = baseTokenOriginal
    let qtFormatted = quoteTokenOriginal

    //on coinbase usdc is the same as usd
    if (baseTokenOriginal.toLowerCase() === 'usdc') btFormatted = 'usd'
    if (quoteTokenOriginal.toLowerCase() === 'usdc') qtFormatted = 'usd'

    const coinbaseWebSocketUrl = 'wss://ws-feed.exchange.coinbase.com';

    const coinbaseSocket = new WebSocket(coinbaseWebSocketUrl);

    if (flipped == undefined) flipped = false;
    let tokenPairString = `${baseTokenOriginal}/${quoteTokenOriginal}`
    if (flipped) tokenPairString = `${quoteTokenOriginal}/${baseTokenOriginal}`

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
            if ((btFormatted == "eur" || qtFormatted == "eur") && !flipped) {
                //flip tokens and retry the connection.
                console.log("Flipping coinbase token pair")
                //Must test if this gets stored as the current token pairs ws connetion
                return openCoinbaseWs(quoteTokenOriginal, baseTokenOriginal, true)
            }

            if (priceObject.reason.includes("not a valid product")) {
                TokenPairPrices[tokenPairString].coinbase = PairStatus.NoPairFound
            }
        } else {
            try {
                let price = parseFloat(priceObject.price)
                if (!Number.isNaN(price)) {
                    if (flipped) {
                        price = 1 / price;
                    }
                    TokenPairPrices[tokenPairString].coinbase = price
                }
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