import express from 'express';
import http from 'http'
import { Server } from "socket.io";
import { calculatePrices, isNewReponse, resetPriceResponse } from './emit.js';
import { getTokenPair, tokensFlipped } from './utils/tokenPair.js';
import { ConnectionsNumber as NumberConnections, PriceQuery, TokenPair, TokenPairConnections as TradingPairConnections, TradingPairPrices } from './types.js';
import { addOneConnection, minusOneConnection, openExchangeWsConnections } from './utils/connections.js';

const app = express();

// deepcode ignore HttpToHttps: implementing on localhost is not worth the time investment, production already uses https connection
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
    console.log("Client connected")
    let previousTokenPair: TokenPair;

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
            oneInch: false,
        },
        includeFees: false,
        isSelling: false,
        isArbitrage: false
    }; // Variable to store previous query data

    let currentTokenPair: TokenPair = { base: "", quote: "" };

    socket.on('get-price', async ({ inputToken, outputToken, inputAmount, cexList, includeFees, isSelling, isArbitrage }: PriceQuery) => {
        const currentQueryData: PriceQuery = { inputToken, outputToken, inputAmount, cexList,  includeFees, isSelling, isArbitrage};
        console.log(currentQueryData);

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
                console.log("Token connections: ", ConnectionsNumber)
            }

            //checks if new input amount is different to old one  or if tokens got flipped
            if (currentQueryData.inputAmount != previousQueryData.inputAmount || tokensFlipped(previousQueryData, currentQueryData)) {
                queryChanged = true;
                previousTokenPair = currentTokenPair;
            }

            //checks if includeFees or isSelling has changed
            if (currentQueryData.includeFees != previousQueryData.includeFees) queryChanged = true;
            if (currentQueryData.isSelling != previousQueryData.isSelling) queryChanged = true;

            previousQueryData = { ...currentQueryData };
        }

        let newReponse = isNewReponse(queryChanged, tokenPairString);

        if (newReponse) {
            let arbitrageSellPrices = undefined;
            if (isArbitrage) {
                isSelling = false;
                console.log("[DEBUG] Arb calculation")
                arbitrageSellPrices = await calculatePrices(TokenPairPrices[tokenPairString], inputAmount, inputToken, outputToken, currentTokenPair, includeFees, true);
            }

            let prices = await calculatePrices(TokenPairPrices[tokenPairString], inputAmount, inputToken, outputToken, currentTokenPair, includeFees, isSelling);
            console.log("Emitting new price reponse - include withdraw fees?", includeFees, "is selling?", isSelling, "is arbitrage?", isArbitrage);
            socket.emit('get-price', { 
                response: {
                    prices: prices,
                    arbitrageSellPrices: arbitrageSellPrices
                }
            });
        }
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected')
        try {
            if (previousTokenPair != undefined) minusOneConnection(`${previousTokenPair.base}/${previousTokenPair.quote}`);
        } catch (error) {
            console.log("[Error] Disconnection: ", error)
        }
    })
})

server.listen(pricePort, () => {
    console.log(`Server running on port ${pricePort}`);
})