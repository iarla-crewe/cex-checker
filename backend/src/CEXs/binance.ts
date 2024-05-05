import WebSocket from "ws";
import { currentPrices } from "../emit.js";

export let binancePrice: string;

let binanceDepoistFee = {
    sol: 0
}
let binanceWithdrawFee = {
    usdc: 1
}

let binanceSocket: WebSocket | null = null;

export const openBinanceWs = (quoteToken: string, baseToken: string) => {


    const binanceWebSocketUrl = `wss://stream.binance.com:9443/ws/${quoteToken + baseToken}@trade`;

    const binanceSocket = new WebSocket(binanceWebSocketUrl);
    
    binanceSocket.onopen = () => {
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
        if (!Number.isNaN(parseFloat(priceObject.p))) currentPrices.binance = parseFloat(priceObject.p)
        //console.log("new binance price: ", currentPrices.binance)
    };
    
    binanceSocket.on('close', (code: number, reason: string) => {
        console.log(`Binance webSocket connection closed, code: ${code}, reason: ${reason}`);
    });
    
    binanceSocket.on('error', (error: Error) => {
        console.error('Binance webSocket error:', error.message);
    });
    
    return binanceSocket;
}