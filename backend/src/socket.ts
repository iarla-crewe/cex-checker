import express, { Request, Response } from 'express';
import http from 'http'
import { Server } from "socket.io";
import { sortedPrices } from './prices.js';

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

//client must make connection make a get-price request with the default search params
// automatically when they open the site

//When user updates search params, client must send another get-price 
//requrest with the updated params

//connection with the client
io.on('connection', (socket) => {
    //We get the search params
    socket.on('get-price', ({inputToken, outputToken, inputAmount, cexList}: PriceQuery) => {
        //get the sorted prices here (maybe)

        //send the client the sortedPrices
        socket.emit('get-price', {sortedPrices})
    })
})