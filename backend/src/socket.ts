import express, { Request, Response } from 'express';
import http from 'http'
import { Server } from "socket.io";
import { prices } from './prices.js';
import { getBinancePrice } from './CEXs/binance.js';
import { getKrakenPrice } from './CEXs/kraken.js';
import { getBybitPrice } from './CEXs/bybit.js';
import WebSocket from 'ws';

const app = express();

const server = http.createServer(app)

export const io = new Server(server, {
    cors: {
        origin: '*',
    },
})

type CexList = {
    binance: boolean,
    kraken: boolean,
    coinbase: boolean,
    crypto_com: boolean,
    bybit: boolean,
}

type PriceQuery = {
    inputToken: string,
    outputToken: string,
    inputAmount: number,
    cexList: CexList
}

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

//client must make connection make a get-price request with the default search params
// automatically when they open the site

//When user updates search params, client must send another get-price 
//requrest with the updated params

//connection with the client
io.on('connection', (socket) => {
    console.log("Connection")
    let binanceSocket: WebSocket;
    let krakenSocket: WebSocket;
    let bybitSocket: WebSocket;

    let previousQueryData: PriceQuery; // Variable to store previous query data

    socket.on('get-price', ({inputToken, outputToken, inputAmount, cexList}: PriceQuery) => {
        const currentQueryData: PriceQuery = { inputToken, outputToken, inputAmount, cexList };

        // Check if the current query is the same as the previous one
        if (JSON.stringify(currentQueryData) !== JSON.stringify(previousQueryData)) {
            //if binanceSocket was already initialised and running -> close it
            if (binanceSocket) binanceSocket.close()
            if (krakenSocket) krakenSocket.close()
            if (bybitSocket) bybitSocket.close()

            binanceSocket = getBinancePrice(inputToken, outputToken, inputAmount)
            krakenSocket = getKrakenPrice(inputToken, outputToken, inputAmount)
            bybitSocket = getBybitPrice(inputToken, outputToken, inputAmount)
            //send the client the sortedPrices
            console.log("emitting sorted prices: ", prices)
            io.emit('get-price', {sortedPrices: prices})
    
            previousQueryData = currentQueryData;
        } else {
            //if the query is the same as previous -> emit sorted Prices
            io.emit('get-price', {sortedPrices: prices})
        }
    })
})

server.listen(3001, () => {
    console.log("Server running at http://localhost:3001");
})