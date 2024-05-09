import WebSocket from 'ws';
import dotenv from 'dotenv';
import { TokenPairPrices } from '../index.js';
dotenv.config();

export const openKrakenWs = (baseToken: string, quoteToken: string) => {

    let publicWebSocketURL = "wss://ws.kraken.com/";
    let publicWebSocketSubscriptionMsg = `{ "event":"subscribe", "subscription":{"name":"trade"},"pair":["${baseToken.toUpperCase()}/${quoteToken.toUpperCase()}"] }`;

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
                TokenPairPrices[`${baseToken}/${quoteToken}`].kraken = parseFloat(innerArray[0])
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