import WebSocket from "ws";
import { currentPrices } from "../emit.js";

export let bybitPrice: string;

let bybitDepoistFee = {
    sol: 0
}
let bybitWithdrawFee = {
    usdc: 1
}

export const openBybitWs = (quoteToken: string, baseToken: string) => {
    const bybitWebSocketUrl = 'wss://stream.bybit.com/v5/public/spot';

    const bybitSocket = new WebSocket(bybitWebSocketUrl);

    bybitSocket.onopen = () => {
        bybitSocket.send(JSON.stringify({ 
            "op": "subscribe", 
            "args": [`publicTrade.${(quoteToken + baseToken).toUpperCase()}`] 
        }))
        console.log("Connecting with bybit")
    }

    bybitSocket.onmessage = ({ data }: any) => {
        let priceObject = JSON.parse(data)
        try {
            currentPrices.bybit = parseFloat(priceObject.data[0].p)
            //console.log("new bybit price: ", currentPrices.bybit)
        } catch (error) {
            console.log("Bybit data object does not contain a price")
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