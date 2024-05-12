import WebSocket from "ws";
import { TokenPairPrices } from "../index.js";

export const openBinanceWs = (baseToken: string, quoteToken: string) => {


    const binanceWebSocketUrl = `wss://stream.binance.com:9443/ws/${baseToken + quoteToken}@trade`;

    const binanceSocket = new WebSocket(binanceWebSocketUrl);
    
    binanceSocket.onopen = () => {
        binanceSocket.send(JSON.stringify({
            "method": "SUBSCRIBE",
            "params":
            [
            `${baseToken + quoteToken}@trade`,
            ],
            "id": 1
            }))
            console.log("Connecting with binance")

    }

    binanceSocket.onmessage = ({ data }: any) => {
        let priceObject = JSON.parse(data)
        if (!Number.isNaN(parseFloat(priceObject.p))) TokenPairPrices[`${baseToken}/${quoteToken}`].binance = parseFloat(priceObject.p)
    };
    
    binanceSocket.on('close', (code: number, reason: string) => {
        console.log(`Binance webSocket connection closed, code: ${code}, reason: ${reason}`);
    });
    
    binanceSocket.on('error', (error: Error) => {
        console.error('Binance webSocket error:', error.message);
    });
    
    return binanceSocket;
}