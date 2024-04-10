import axios from 'axios';
import crypto from 'crypto';
import WebSocket from 'ws';
import { minusFees, sortPrices } from '../prices.js';
import { binancePrice } from './binance.js';
import dotenv from 'dotenv';
import { bybitPrice } from './bybit.js';
dotenv.config();

export let krakenPrice: string;

let krakenDepoistFee = {
    sol: 0
}
let krakenWithdrawFee = {
    usdc: 1
}
let krakenMakerFee: number = 0.0024;
let krakenTakerFee: number = 0.004;

//example code: https://support.kraken.com/hc/en-us/articles/4413834730260-Example-code-for-NodeJs-REST-and-WebSocket-API

export const getKrakenPrice =  (inputToken: string, outputToken: string, inputAmount: number) => {

    //TODO: UPDATE WITH YOUR KEYS :)
    let apiPublicKey = process.env.KRAKEN_PUBLIC
    let apiPrivateKey = process.env.KRAKEN_PRIVATE

    //convert usdc into usd or usdt
    outputToken = outputToken.slice(0, -1) + "t";

    let publicWebSocketURL = "wss://ws.kraken.com/";
    let publicWebSocketSubscriptionMsg = `{ "event":"subscribe", "subscription":{"name":"trade"},"pair":["${inputToken.toUpperCase()}/${outputToken.toUpperCase()}"] }`;

    const krakenSocket = new WebSocket(publicWebSocketURL);

    krakenSocket.on('open', function open() {
        krakenSocket.send(publicWebSocketSubscriptionMsg);
    });

    krakenSocket.on('message', function incoming(wsMsg) {
        let priceObject = JSON.parse(wsMsg.toString())


        if (wsMsg.toString() != '{"event":"heartbeat"}' && priceObject.event != "systemStatus" && priceObject.event != "subscriptionStatus") {
            krakenPrice = priceObject

            // Iterate through each nested array
            for (const innerArray of priceObject[1]) {
                // Access the first element (price) of the inner array
                krakenPrice = minusFees(innerArray[0], krakenTakerFee, inputAmount)

                sortPrices(binancePrice, krakenPrice, bybitPrice)
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