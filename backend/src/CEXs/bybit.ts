import WebSocket from "ws";
import { minusFees, sortPrices } from "../prices.js";
import { krakenPrice } from "./kraken.js";
import { binancePrice } from "./binance.js";

export let bybitPrice: string;

let bybitDepoistFee = {
    sol: 0
}
let bybitWithdrawFee = {
    usdc: 4
}
let bybitMakerFee: number = 0.001;
let bybitTakerFee: number = 0.001;

export const getBybitPrice = (inputToken: string, outputToken: string, inputAmount: number) => {
    const bybitWebSocketUrl = 'wss://stream.bybit.com/v5/public/spot';

    const bybitSocket = new WebSocket(bybitWebSocketUrl);

    bybitSocket.onopen = () => {
        bybitSocket.send(JSON.stringify({ 
            "op": "subscribe", 
            "args": ["publicTrade.SOLUSDC"] 
        }))
        console.log("Connecting with bybit")
    }

    bybitSocket.onmessage = ({ data }: any) => {
        let priceObject = JSON.parse(data)
        try {
            bybitPrice = minusFees(priceObject.data[0].p, bybitTakerFee, inputAmount)
            console.log("Bybit price: ", bybitPrice)
        } catch (error) {
            console.log("Bybit data object does not contain a price")
        }
        sortPrices(binancePrice, krakenPrice, bybitPrice);
    };

    bybitSocket.on('close', (code: number, reason: string) => {
        console.log(`WebSocket connection closed, code: ${code}, reason: ${reason}`);
    });

    bybitSocket.on('error', (error: Error) => {
        console.error('WebSocket error:', error.message);
    });

}