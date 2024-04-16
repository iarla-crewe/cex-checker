import WebSocket from "ws";
import { calculatePrice, emitPrices } from "../emit.js";
import { krakenPrice } from "./kraken.js";
import { bybitPrice } from "./bybit.js";
import { exchangeTakerFees, prices } from "./prices.js";

export let binancePrice: string;

let binanceDepoistFee = {
    sol: 0
}
let binanceWithdrawFee = {
    usdc: 4
}

let binanceSocket: WebSocket | null = null;

export const openBinanceWs = (quoteToken: string, baseToken: string) => {


    const binanceWebSocketUrl = `wss://stream.binance.com:9443/ws/${quoteToken + baseToken}@trade`;

    const binanceSocket = new WebSocket(binanceWebSocketUrl);
    
    binanceSocket.onopen = () => {
        console.log("Quote token: ", quoteToken)
        console.log("bae token: ", baseToken)
        binanceSocket.send(JSON.stringify({
            "method": "SUBSCRIBE",
            "params":
            [
            `${quoteToken + baseToken}@trade`,
            ],
            "id": 1
            }))
            console.log("Connecting with binance")

    }

    binanceSocket.onmessage = ({ data }: any) => {
        let priceObject = JSON.parse(data)
        prices.binance = calculatePrice(priceObject.p, exchangeTakerFees.binance)
        emitPrices(prices)
    };
    
    binanceSocket.on('close', (code: number, reason: string) => {
        console.log(`Binance webSocket connection closed, code: ${code}, reason: ${reason}`);
    });
    
    binanceSocket.on('error', (error: Error) => {
        console.error('Binance webSocket error:', error.message);
    });
    
    return binanceSocket;
}