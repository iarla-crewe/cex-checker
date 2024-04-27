import WebSocket from "ws";
import { currentPrices } from "../emit.js";

let coinbaseDepoistFee = {
    sol: 0,
    usdc: 0
}
let coinbaseWithdrawFee = {
    usdc: 0.9
}

export const openCoinbaseWs = (quoteToken: string, baseToken: string) => {
    const coinbaseWebSocketUrl = 'wss://ws-feed.exchange.coinbase.com';

    const coinbaseSocket = new WebSocket(coinbaseWebSocketUrl);

    coinbaseSocket.onopen = () => {
        coinbaseSocket.send(JSON.stringify({
            "type": "subscribe",
            "product_ids": [
                "SOL-USD"
            ],
            "channels": [
                "level2",
                "heartbeat",
                {
                    "name": "ticker",
                    "product_ids": [
                        "SOL-USD",
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
            if (!Number.isNaN(price)) currentPrices.coinbase = price
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