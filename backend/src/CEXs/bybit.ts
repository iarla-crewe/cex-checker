import WebSocket from "ws";
import { TokenPairPrices } from "../index.js";
import { PairStatus } from "../types.js";

export const openBybitWs = (baseToken: string, quoteToken: string) => {
    const bybitWebSocketUrl = 'wss://stream.bybit.com/v5/public/spot';

    const bybitSocket = new WebSocket(bybitWebSocketUrl);

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
            if (priceObject.ret_msg.includes("Invalid symbol")) {
                TokenPairPrices[`${baseToken}/${quoteToken}`].bybit = PairStatus.NoPairFound
            }
        } else {
            try {
                TokenPairPrices[`${baseToken}/${quoteToken}`].bybit = parseFloat(priceObject.data[0].p)
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