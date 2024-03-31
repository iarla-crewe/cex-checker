import WebSocket from "ws";
import { minusFees, sortPrices } from "../prices.js";
import { binancePrice } from "./binance.js";
import { krakenPrice } from "./kraken.js";

export let coinbasePrice: string;

let coinbaseDepoistFee = {
    sol: 0
}
let coinbaseWithdrawFee = {
    usdc: 4
}
let coinbaseMakerFee: number = 0.001;
let coinbaseTakerFee: number = 0.001;

export const getCoinbasePrice = (inputToken: string, outputToken: string, inputAmount: number) => {
    const coinbaseWebSocketUrl = 'wss://ws-feed.exchange.coinbase.com';

    const coinbaseSocket = new WebSocket(coinbaseWebSocketUrl);
    
    coinbaseSocket.onopen = () => {
        coinbaseSocket.send(JSON.stringify({
            "method": "SUBSCRIBE",
            "params":
            [
            `${inputToken}${outputToken}@aggTrade`,
            ],
            "id": 1
            }))
    }
    
    coinbaseSocket.onmessage = ({data}: any) => {
        let priceObject = JSON.parse(data)
        coinbasePrice = minusFees(priceObject.p, coinbaseTakerFee, inputAmount)
        
        sortPrices(coinbasePrice, krakenPrice);
    };
    
    coinbaseSocket.on('close', (code: number, reason: string) => {
        console.log(`WebSocket connection closed, code: ${code}, reason: ${reason}`);
    });
    
    coinbaseSocket.on('error', (error: Error) => {
        console.error('WebSocket error:', error.message);
    });
    
}

