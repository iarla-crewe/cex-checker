import express from 'express';
import http from 'http'
import { Server } from "socket.io";
import { currentPrices, updateTokenAmount } from './emit.js';
import { openBinanceWs } from './CEXs/binance.js';
import { openKrakenWs } from './CEXs/kraken.js';
import { openBybitWs } from './CEXs/bybit.js';
import WebSocket from 'ws';
import { getBaseToken } from './utils/baseToken.js';
import { CexList, PriceQuery, Prices, TokenPair } from './types.js';
import { getExchangePrices } from './CEXs/prices.js';
const app = express();

const server = http.createServer(app)

const port = 443;

export const io = new Server(server, {
    cors: {
        origin: '*',
    },
})

let cexList: CexList = {
    binance: true,
    kraken: true,
    coinbase: false,
    crypto_com: false,
    bybit: false,
}

let params: PriceQuery = {
    inputToken: 'sol',
    outputToken: 'usdc',
    inputAmount: 1,
    cexList: cexList
}

//connection with the client
io.on('connection', (socket) => {
    console.log("Connection")
    let binanceSocket: WebSocket;
    let krakenSocket: WebSocket;
    let bybitSocket: WebSocket;

    let previousQueryData: PriceQuery; // Variable to store previous query data
    let previousTokenPair: TokenPair;

    socket.on('get-price', ({ inputToken, outputToken, inputAmount, cexList }: PriceQuery) => {
        const currentQueryData: PriceQuery = { inputToken, outputToken, inputAmount, cexList };

        let currentTokenPair: TokenPair = {
            quote: "",
            base: ""
        };

        try { currentTokenPair = getBaseToken(inputToken, outputToken); }
        catch (error) { 
            console.log("Base token getting error: ", error)
            io.emit('error', { error }) }

        console.log("Current token pair: ", currentTokenPair)
        // Check if the current query is not the same as the previous one
        if (JSON.stringify(currentQueryData) !== JSON.stringify(previousQueryData)) {

            //new tokenpair is different 
            if (JSON.stringify(currentTokenPair) !== JSON.stringify(previousTokenPair)) {
                //close old websockets
                if (binanceSocket) binanceSocket.close()
                if (krakenSocket) krakenSocket.close()
                if (bybitSocket) bybitSocket.close()

                updateTokenAmount(inputAmount)
                //open new ws connection with the new tokenPair
                //TODO: only open based on the CEX list
                binanceSocket = openBinanceWs(currentTokenPair.quote, currentTokenPair.base)
                krakenSocket = openKrakenWs(currentTokenPair.quote, currentTokenPair.base)
                bybitSocket = openBybitWs(currentTokenPair.quote, currentTokenPair.base)

                //let prices = getExchangePrices(binanceSocket, krakenSocket, bybitSocket)
            } else if (currentQueryData.inputAmount != previousQueryData.inputAmount) {
                updateTokenAmount(inputAmount)
            }
            previousQueryData = currentQueryData;
        }
        console.log("emitting prices: ", currentPrices)
        io.emit('get-price', { prices: currentPrices })
        //if the query is the same as previous -> emit previously sorted Prices
        //let the web sockets do their thing
    })
})

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})
