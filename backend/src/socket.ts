import express, { Request, Response } from 'express';
import http from 'http'
import { Server } from "socket.io";
import { sortedPrices } from './prices.js';
import { getBinancePrice } from './binance.js';
import { getKrakenPrice } from './kraken.js';

const app = express();

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
    },
})

type CexList = {
    binance: boolean,
    kraken: boolean
}

type PriceQuery = {
    inputToken: string,
    outputToken: string,
    inputAmount: number,
    cexList: CexList
}

let cexList: CexList = {
    binance: true,
    kraken: true
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
    //We get the search params
    console.log("Connection")
            //get the sorted prices here (maybe)

    socket.on('get-price', ({inputToken, outputToken, inputAmount, cexList}: PriceQuery) => {
        getBinancePrice(inputToken, outputToken, inputAmount)
        getKrakenPrice(inputToken, outputToken, inputAmount)
        //send the client the sortedPrices
        console.log("emitting sorted prices: ", sortedPrices)
        io.emit('get-price', {sortedPrices})
    })
})

server.listen(3001, () => {
    console.log("Server running at http://localhost:3001");
})