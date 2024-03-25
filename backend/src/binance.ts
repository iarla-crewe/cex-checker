import WebSocket from "ws";
import { sortPrices } from "./prices.js";
import { krakenPrice } from "./kraken.js";

export let binancePrice: string;

export const getBinancePrice = (ticker: string) => {
    const binanceWebSocketUrl = 'wss://stream.binance.com:9443/ws/solusdt@avgPrice';

    const binanceSocket = new WebSocket(binanceWebSocketUrl);
    
    binanceSocket.onopen = () => {
        binanceSocket.send(JSON.stringify({
            "method": "SUBSCRIBE",
            "params":
            [
            `${ticker}usdt@trade`,
            ],
            "id": 1
            }))
    }
    
    binanceSocket.onmessage = ({data}: any) => {
        let priceObject = JSON.parse(data)
        binancePrice = priceObject.p;

        sortPrices(binancePrice, krakenPrice);
    };
    
    binanceSocket.on('close', (code: number, reason: string) => {
        console.log(`WebSocket connection closed, code: ${code}, reason: ${reason}`);
    });
    
    binanceSocket.on('error', (error: Error) => {
        console.error('WebSocket error:', error.message);
    });
    
}

