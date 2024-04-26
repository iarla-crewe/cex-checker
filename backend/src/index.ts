import express from 'express';
import http from 'http'
import { Server } from "socket.io";
import { calculatePrices, currentPrices, isNewReponse, resetPriceResponse } from './emit.js';
import { openBinanceWs } from './CEXs/binance.js';
import { openKrakenWs } from './CEXs/kraken.js';
import { openBybitWs } from './CEXs/bybit.js';
import WebSocket from 'ws';
import { getBaseToken, tokensFlipped } from './utils/baseToken.js';
import { CexList, PriceQuery, TokenPair } from './types.js';
import { openCrypto_comWs } from './CEXs/crypto-com.js';
import { openCoinbaseWs } from './CEXs/coinbase.js';

const app = express();

const server = http.createServer(app)

const pricePort = process.env.PORT || 443;
const feesPort = 3001;

export const io = new Server(server, {
    cors: {
        origin: '*',
    },
})

let cexList: CexList = {
    binance: true,
    kraken: true,
    coinbase: true,
    crypto_com: true,
    bybit: true,
}

let params: PriceQuery = {
    inputToken: 'sol',
    outputToken: 'usdc',
    inputAmount: 1,
    cexList: cexList
}

const defaultQueryData: PriceQuery = {
    inputToken: 'SOL',
    outputToken: 'USDC',
    inputAmount: 1,
    cexList: {
        binance: true,
        kraken: true,
        coinbase: false,
        crypto_com: false,
        bybit: true
    }
};

//connection with the client
io.on('connection', (socket) => {
    console.log("Connection")
    let binanceSocket: WebSocket;
    let bybitSocket: WebSocket;
    let coinbaseSocket: WebSocket;
    let crypto_comSocket: WebSocket;
    let krakenSocket: WebSocket;

    let previousTokenPair: TokenPair;
    let previousInputToken: string;

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

        let currentTokenPair: TokenPair = { quote: "", base: "" };

        try { currentTokenPair = getBaseToken(inputToken, outputToken); }
        catch (error) {  io.emit('error', { error }) }
        let queryChanged = false;

        // Check if the current query is not the same as the previous one
        if (JSON.stringify(currentQueryData) !== JSON.stringify(previousQueryData)) {

            //check if tokens are different regardless of order
            //TODO: change so that it also checks to see if the currentTokenPair is the default && the
            if (JSON.stringify(currentTokenPair) !== JSON.stringify(previousTokenPair)) {
                //set currentPrices to undefined
                if (previousTokenPair !== undefined) resetPriceResponse()
            
                //close old websockets
                if (binanceSocket) binanceSocket.close()
                if (bybitSocket) bybitSocket.close()
                if (coinbaseSocket) coinbaseSocket.close()
                if (crypto_comSocket) crypto_comSocket.close()
                if (krakenSocket) krakenSocket.close()

                //open new ws connection with the new tokenPair
                binanceSocket = openBinanceWs(currentTokenPair.quote, currentTokenPair.base)
                bybitSocket = openBybitWs(currentTokenPair.quote, currentTokenPair.base)
                coinbaseSocket = openCoinbaseWs(currentTokenPair.quote, currentTokenPair.base)
                crypto_comSocket = openCrypto_comWs(currentTokenPair.quote, currentTokenPair.base)
                krakenSocket = openKrakenWs(currentTokenPair.quote, currentTokenPair.base)

                previousTokenPair = currentTokenPair;
            } 
            //checks if new input amount is different to old one  or check if querys inputtoken == previous output token && query outputtoke == previous input token
            if (currentQueryData.inputAmount != previousQueryData.inputAmount || tokensFlipped(previousQueryData, currentQueryData)) {
                queryChanged = true
                previousTokenPair = currentTokenPair;
                previousInputToken = currentQueryData.inputToken
            }
            previousQueryData = currentQueryData;
        }
        let prices = calculatePrices(currentPrices, inputAmount, inputToken, currentTokenPair)
        let response = isNewReponse(queryChanged)
        if (response)  {
            console.log("Emitting new reponse:", prices)
            socket.emit('get-price', { prices: prices });
        }
    })

    socket.on('disconnect', () => { 
        //close the websockets
        console.log('Client disconnected') 
      }) 
})

server.listen(pricePort, () => {
    console.log(`Server running at http://localhost:${pricePort}`);
})