import WebSocket from 'ws';
import dotenv from 'dotenv';
import { TokenPairPrices } from '../index.js';
import { PairStatus } from '../types.js';
import axios from 'axios';
dotenv.config();

export const openKrakenWs = (baseToken: string, quoteToken: string, flipped?: boolean) => {

    let publicWebSocketURL = "wss://ws.kraken.com/";
    let publicWebSocketSubscriptionMsg = `{ "event":"subscribe", "subscription":{"name":"trade"},"pair":["${baseToken.toUpperCase()}/${quoteToken.toUpperCase()}"] }`;

    if (flipped == undefined) flipped = false;
    let tokenPairString = `${baseToken}/${quoteToken}`
    if (flipped) tokenPairString = `${quoteToken}/${baseToken}`

    const krakenSocket = new WebSocket(publicWebSocketURL);

    krakenSocket.on('open', function open() {
        krakenSocket.send(publicWebSocketSubscriptionMsg);
    });

    krakenSocket.on('message', function incoming(wsMsg) {
        let priceObject = JSON.parse(wsMsg.toString())

        if (priceObject.status === 'error') {
            if ((baseToken == "eur" || quoteToken == "eur") && !flipped) {
                //flip tokens and retry the connection.
                //Must test if this gets stored as the current token pairs ws connetion
                return openKrakenWs(quoteToken, baseToken, true)
            }

            if (priceObject.errorMessage.includes("Currency pair not supported")) {
                TokenPairPrices[tokenPairString].kraken = PairStatus.NoPairFound
            }
        } else {
            if (wsMsg.toString() != '{"event":"heartbeat"}' && priceObject.event != "systemStatus" && priceObject.event != "subscriptionStatus") {
                // Iterate through each nested array
                for (const innerArray of priceObject[1]) {
                    // Access the first element (price) of the inner array
                    let price = parseFloat(innerArray[0])
                    if (flipped) {
                        price = 1 / price;
                    }
                    TokenPairPrices[tokenPairString].kraken = price
                }
            }
        }
    });

    krakenSocket.on('close', (code: number, reason: string) => {
        console.log(`Kraken WebSocket connection closed, code: ${code}, reason: ${reason}`);
    });

    krakenSocket.on('error', (error: Error) => {
        console.error('[Error] Kraken WebSocket:', error.message);
    });

    return krakenSocket;
};

export const getCurrentKrakenPrice = async (baseToken: string, quoteToken: string) => {
    let tokenPairString = `${baseToken}/${quoteToken}`

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.kraken.com/0/public/Trades?pair=${baseToken.toUpperCase()}${quoteToken.toUpperCase()}&count=1`,
        headers: {
            'Accept': 'application/json'
        }
    };
    let response;
    try {
        response = await axios(config);
    } catch (error) {
        //@ts-ignore
        console.log("[Error] Kraken API call: ", error.response.data)
        TokenPairPrices[tokenPairString].kraken = PairStatus.NoPairFound
        return
    }

    if (response.data.error.length != 0) {
        console.log("[Error] Kraken: ", response.data.error[0]);
        TokenPairPrices[tokenPairString].kraken = PairStatus.NoPairFound
        return
    }
    let price;
    try {
        price = Number(response.data.result[`${baseToken.toUpperCase()}${quoteToken.toUpperCase()}`][0][0]);
    } catch (error) {
        TokenPairPrices[tokenPairString].kraken = PairStatus.NoPairFound
    }
    if (price == undefined) {
        TokenPairPrices[tokenPairString].kraken = PairStatus.NoPairFound
        return
    }
    TokenPairPrices[tokenPairString].kraken = price!
    return;
}