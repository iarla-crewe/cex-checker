import WebSocket from "ws";
import { TokenPairPrices } from "../index.js";
import { PairStatus } from "../types.js";

export const openBinanceWs = (baseToken: string, quoteToken: string) => {
     const binanceWebSocketUrl = `wss://stream.binance.com:9443/ws/${baseToken + quoteToken}@trade`;

    const binanceSocket = new WebSocket(binanceWebSocketUrl);

    let isLoading = true;
    let foundPrice = false;

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

        setTimeout(() => {
            isLoading = false;
            if (!foundPrice) TokenPairPrices[`${baseToken}/${quoteToken}`].binance = PairStatus.NoPairFound
        }, 30000);
    }

    binanceSocket.onmessage = ({ data }: any) => {
        let priceObject = JSON.parse(data)

        if (priceObject.s != `${baseToken.toUpperCase()+quoteToken.toUpperCase()}` && !isLoading) {
            TokenPairPrices[`${baseToken}/${quoteToken}`].binance = PairStatus.NoPairFound
        } else {
            if (!Number.isNaN(parseFloat(priceObject.p))) {
                TokenPairPrices[`${baseToken}/${quoteToken}`].binance = parseFloat(priceObject.p)
                foundPrice = true;
            } else {
                TokenPairPrices[`${baseToken}/${quoteToken}`].binance = PairStatus.Loading
            }
        }
    };

    binanceSocket.on('close', (code: number, reason: string) => {
        console.log(`Binance webSocket connection closed, code: ${code}, reason: ${reason}`);
    });

    binanceSocket.on('error', (error: Error) => {
        console.error('Binance webSocket error:', error.message);
    });

    return binanceSocket;
}