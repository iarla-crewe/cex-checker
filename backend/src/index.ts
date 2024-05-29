import express from 'express';
import http from 'http'
import { Server } from "socket.io";
import { calculatePrices, isNewReponse, resetPriceResponse } from './emit.js';
import { getTokenPair, tokensFlipped } from './utils/tokenPair.js';
import { ConnectionsNumber as NumberConnections, PriceQuery, TokenPair, TokenPairConnections as TradingPairConnections, TradingPairPrices } from './types.js';
import { addOneConnection, minusOneConnection, openExchangeWsConnections } from './utils/connections.js';

const app = express();

const server = http.createServer(app)

const pricePort = process.env.PORT || 443;
const feesPort = 3001;

export const io = new Server(server, {
    cors: {
        origin: '*',
    },
})

export let TokenPairConnections: TradingPairConnections = {}
export let ConnectionsNumber: NumberConnections = {}
export let TokenPairPrices: TradingPairPrices = {}
export let PreviousPrices: TradingPairPrices = {}


//connection with the client
io.on('connection', (socket) => {
    console.log("Connection")
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
            bybit: false,
            jupiter: false,
        }
    }; // Variable to store previous query data

    let currentTokenPair: TokenPair = { base: "", quote: "" };

    socket.on('get-price', ({ inputToken, outputToken, inputAmount, cexList }: PriceQuery) => {
        const currentQueryData: PriceQuery = { inputToken, outputToken, inputAmount, cexList };

        try { currentTokenPair = getTokenPair(inputToken, outputToken); }
        catch (error) { io.emit('error', { error }) }
        let queryChanged = false;

        const tokenPairString: string = `${currentTokenPair.base}/${currentTokenPair.quote}`;

        // Check if the current query is not the same as the previous one
        if (JSON.stringify(currentQueryData) !== JSON.stringify(previousQueryData)) {

            //check if tokens pairs are different
            if (JSON.stringify(currentTokenPair) !== JSON.stringify(previousTokenPair)) {

                if (previousTokenPair !== undefined) {
                    const previousPairString: string = `${previousTokenPair.base}/${previousTokenPair.quote}`;
                    minusOneConnection(previousPairString);
                    resetPriceResponse(previousPairString)
                }

                addOneConnection(tokenPairString);

                //If no ws connection for this tokenpair is made already, open new ws connection with the new tokenPair
                openExchangeWsConnections(currentTokenPair)

                previousTokenPair = currentTokenPair;
                console.log("Token Connections: ", ConnectionsNumber)

            }
            //checks if new input amount is different to old one  or if tokens got flipped
            if (currentQueryData.inputAmount != previousQueryData.inputAmount || tokensFlipped(previousQueryData, currentQueryData)) {
                queryChanged = true
                previousTokenPair = currentTokenPair;
                previousInputToken = currentQueryData.inputToken
            }
            previousQueryData = { ...currentQueryData };
        }
        let prices = calculatePrices(TokenPairPrices[tokenPairString], inputAmount, inputToken, currentTokenPair)
        let response = isNewReponse(queryChanged, tokenPairString)
        if (response) {
            console.log("Emitting new reponse:", prices)
            socket.emit('get-price', { prices: prices });
        }
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected')
        try {
            if (previousTokenPair != undefined) minusOneConnection(`${previousTokenPair.base}/${previousTokenPair.quote}`);
        } catch (error) {
            console.log("Disconnection: ", error)
        }
    })
})

server.listen(pricePort, () => {
    console.log(`Server running at http://localhost:${pricePort}`);
})