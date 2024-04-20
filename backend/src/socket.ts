import express from 'express';
import http from 'http'
import { Server } from "socket.io";
import { currentPrices, emitPrices, resetPriceResponse, updateQueryChanged, updateTokenAmount } from './emit.js';
import { openBinanceWs } from './CEXs/binance.js';
import { openKrakenWs } from './CEXs/kraken.js';
import { openBybitWs } from './CEXs/bybit.js';
import WebSocket from 'ws';
import { getBaseToken } from './utils/baseToken.js';
import { CexList, PriceQuery, TokenPair } from './types.js';
const app = express();

const server = http.createServer(app)

const socketioPort = 443;

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

export let previousTokenPair: TokenPair;
export let previousImportToken: string;

//connection with the client
io.on('connection', (socket) => {
    console.log("Connection")
    let binanceSocket: WebSocket;
    let krakenSocket: WebSocket;
    let bybitSocket: WebSocket;

    let previousQueryData: PriceQuery = {
        inputToken: '',
        outputToken: '',
        inputAmount: 0,
        cexList: {
            binance: false,
            kraken: false,
            coinbase: false,
            crypto_com: false,
            bybit: false
        }
    }; // Variable to store previous query data

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

            //check if tokens are different regardless of order
            if (JSON.stringify(currentTokenPair) !== JSON.stringify(previousTokenPair)) {
                //set currentPrices to undefined
                resetPriceResponse()
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

                previousTokenPair = currentTokenPair;
                //let prices = getExchangePrices(binanceSocket, krakenSocket, bybitSocket)
            } 
            //checks if new input amount is different to old one  or check if querys inputtoken == previous output token && query outputtoke == previous input token
            if (currentQueryData.inputAmount != previousQueryData.inputAmount || tokensFlipped(previousQueryData, currentQueryData)) {
                console.log("Token amount is different or tokens got flipped")
                updateQueryChanged()
                updateTokenAmount(inputAmount)
                previousTokenPair = currentTokenPair;
                previousImportToken = currentQueryData.inputToken
            }
            previousQueryData = currentQueryData;
        }
        emitPrices(currentPrices)
    })
})

server.listen(socketioPort, () => {
    console.log(`Server running at http://localhost:${socketioPort}`);
})


const tokensFlipped = (previousQuery: PriceQuery, newQuery: PriceQuery) => {
    if (previousQuery.inputToken == newQuery.outputToken && previousQuery.outputToken == newQuery.inputToken) {
        return true
    }
    return false
}