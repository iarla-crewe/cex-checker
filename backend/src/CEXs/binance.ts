import WebSocket from "ws";
import { minusFees, sortPrices } from "../prices.js";
import { krakenPrice } from "./kraken.js";

export let binancePrice: string;

let binanceDepoistFee = {
    sol: 0
}
let binanceWithdrawFee = {
    usdc: 4
}
let binanceMakerFee: number = 0.001;
let binanceTakerFee: number = 0.001;

export const getBinancePrice = (inputToken: string, outputToken: string, inputAmount: number) => {
    const binanceWebSocketUrl = 'wss://stream.binance.com:9443/ws/solusdt@avgPrice';

    const binanceSocket = new WebSocket(binanceWebSocketUrl);
    
    binanceSocket.onopen = () => {
        binanceSocket.send(JSON.stringify({
            "method": "SUBSCRIBE",
            "params":
            [
            `${inputToken}${outputToken}@aggTrade`,
            ],
            "id": 1
            }))
    }
    
    binanceSocket.onmessage = ({data}: any) => {
        let priceObject = JSON.parse(data)
        binancePrice = minusFees(priceObject.p, binanceTakerFee, inputAmount)
        
        sortPrices(binancePrice, krakenPrice);
    };
    
    binanceSocket.on('close', (code: number, reason: string) => {
        console.log(`WebSocket connection closed, code: ${code}, reason: ${reason}`);
    });
    
    binanceSocket.on('error', (error: Error) => {
        console.error('WebSocket error:', error.message);
    });
    
}

