import WebSocket from "ws";
import { TokenPairPrices } from "../index.js";
import { PairStatus } from "../types.js";

export const openBybitWs = (baseToken: string, quoteToken: string, flipped?: boolean) => {
    const bybitWebSocketUrl = 'wss://stream.bybit.com/v5/public/spot';

    const bybitSocket = new WebSocket(bybitWebSocketUrl);

    if (flipped == undefined) flipped = false;
    let tokenPairString = `${baseToken}/${quoteToken}`
    if (flipped) tokenPairString = `${quoteToken}/${baseToken}`

    bybitSocket.onopen = () => {
        bybitSocket.send(JSON.stringify({
            "op": "subscribe",
            "args": [`publicTrade.${(baseToken + quoteToken).toUpperCase()}`]
        }))
        console.log("Connecting with bybit")
    }

    bybitSocket.onmessage = ({ data }: any) => {
        let priceObject = JSON.parse(data)

        if (priceObject.success === false) {
            if ((baseToken == "eur" || quoteToken == "eur") && !flipped) {
                //flip tokens and retry the connection.
                console.log("Flipping bybit token pair")
                return openBybitWs(quoteToken, baseToken, true)
            }
            if (priceObject.ret_msg.includes("Invalid symbol")) {
                TokenPairPrices[tokenPairString].bybit = PairStatus.NoPairFound
            }
        } else {
            try {
                let price = parseFloat(priceObject.data[0].p)
                if (flipped) {
                    price = 1 / price;
                }
                TokenPairPrices[tokenPairString].bybit = price
            } catch (error) {
                console.log("Bybit data object does not contain a price")
            }
        }
    };

    bybitSocket.on('close', (code: number, reason: string) => {
        console.log(`Bybit webSocket connection closed, code: ${code}, reason: ${reason}`);
    });

    bybitSocket.on('error', (error: Error) => {
        console.error('Bybit webSocket error:', error.message);
    });

    return bybitSocket;
}