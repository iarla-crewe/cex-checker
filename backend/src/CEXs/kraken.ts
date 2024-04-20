import WebSocket from 'ws';
import { emitPrices } from '../emit.js';
import dotenv from 'dotenv';
import { prices } from './prices.js';
dotenv.config();

export let krakenPrice: string;

let krakenDepoistFee = {
    sol: 0
}
let krakenWithdrawFee = {
    usdc: 1
}

//example code: https://support.kraken.com/hc/en-us/articles/4413834730260-Example-code-for-NodeJs-REST-and-WebSocket-API

export const openKrakenWs =  (quoteToken: string, baseToken: string) => {

    //TODO: UPDATE WITH OUR KEYS
    let apiPublicKey = process.env.KRAKEN_PUBLIC
    let apiPrivateKey = process.env.KRAKEN_PRIVATE

    //convert usdc into usd or usdt
    baseToken = baseToken.slice(0, -1) + "t";

    let publicWebSocketURL = "wss://ws.kraken.com/";
    let publicWebSocketSubscriptionMsg = `{ "event":"subscribe", "subscription":{"name":"trade"},"pair":["${quoteToken.toUpperCase()}/${baseToken.toUpperCase()}"] }`;

    const krakenSocket = new WebSocket(publicWebSocketURL);

    krakenSocket.on('open', function open() {
        krakenSocket.send(publicWebSocketSubscriptionMsg);
        console.log("Connecting with kraken")
    });

    krakenSocket.on('message', function incoming(wsMsg) {
        let priceObject = JSON.parse(wsMsg.toString())

        if (wsMsg.toString() != '{"event":"heartbeat"}' && priceObject.event != "systemStatus" && priceObject.event != "subscriptionStatus") {
            // Iterate through each nested array
            for (const innerArray of priceObject[1]) {
                // Access the first element (price) of the inner array
                prices.kraken = parseFloat(innerArray[0])
                emitPrices(prices)
            }
        }
    });

    krakenSocket.on('close', (code: number, reason: string) => {
        console.log(`Kraken WebSocket connection closed, code: ${code}, reason: ${reason}`);
    });

    krakenSocket.on('error', (error: Error) => {
        console.error('Kraken WebSocket error:', error.message);
    });

    return krakenSocket;
};