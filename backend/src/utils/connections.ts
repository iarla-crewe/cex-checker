import { ConnectionsNumber, PreviousPrices, TokenPairConnections, TokenPairPrices } from "../index.js";
import { getCurrentBinancePrice, openBinanceWs } from "../Exchanges/binance.js";
import { getCurrentBybitPrice, openBybitWs } from "../Exchanges/bybit.js";
import { getCurrentCoinbasePrice, openCoinbaseWs } from "../Exchanges/coinbase.js";
import { getCurrentCrypto_comPrice, openCrypto_comWs } from "../Exchanges/crypto-com.js";
import { getCurrentKrakenPrice, openKrakenWs } from "../Exchanges/kraken.js";
import { PairStatus, TokenPair, ExConnections } from "../types.js";
import { getCurrentJupiterPrice, openJupiterHttp } from "../Exchanges/jupiter.js";
import { getCurrentOneInchPrice, openOneInchHttp } from "../Exchanges/1inch.js";

export const initializeObject = () => {
    return {
        binance: undefined,
        kraken: undefined,
        coinbase: undefined,
        crypto_com: undefined,
        bybit: undefined,
        jupiter: undefined,
        oneInch: undefined,
    }
}

export const initializePriceObject = () => {
    return {
        binance: PairStatus.Loading,
        kraken: PairStatus.Loading,
        coinbase: PairStatus.Loading,
        crypto_com: PairStatus.Loading,
        bybit: PairStatus.Loading,
        jupiter: PairStatus.Loading,
        oneInch: PairStatus.Loading,
    }
}

export const addOneConnection = (tokenPairString: string) => {
    if (Number.isNaN(ConnectionsNumber[tokenPairString]) || ConnectionsNumber[tokenPairString] == undefined) {
        ConnectionsNumber[tokenPairString] = 1; //Initialize the count for that connection
        console.log("Initializing count for : ", tokenPairString)
    }
    else {
        console.log("Plus one for : ", tokenPairString)
        ConnectionsNumber[tokenPairString] += 1; //Add one to that connections count
    }
}

export const minusOneConnection = (previousPairString: string) => {
    try {
        ConnectionsNumber[previousPairString] -= 1;
        if (ConnectionsNumber[previousPairString] <= 0) {
            //close the websockets stored for that tokenpair
            TokenPairConnections[previousPairString]?.binance?.close()
            TokenPairConnections[previousPairString]?.bybit?.close()
            TokenPairConnections[previousPairString]?.coinbase?.close()
            TokenPairConnections[previousPairString]?.crypto_com?.close()
            TokenPairConnections[previousPairString]?.kraken?.close()
            TokenPairConnections[previousPairString]?.jupiter?.close()
            TokenPairConnections[previousPairString]?.oneInch?.close()

            TokenPairConnections[previousPairString] = undefined
        }
    } catch (error) {
        console.log("minus connection error: ", error)
    }
}

export const openExchangeWsConnections =  (currentTokenPair: TokenPair) => {
    const tokenPairString = `${currentTokenPair.base}/${currentTokenPair.quote}`

    if (TokenPairConnections[tokenPairString] == undefined) {
        //call api endpoint for each exchanges current price.
        getCurrentPrices(currentTokenPair.base, currentTokenPair.quote)

        let binanceSocket = openBinanceWs(currentTokenPair.base, currentTokenPair.quote)
        let bybitSocket = openBybitWs(currentTokenPair.base, currentTokenPair.quote)
        let coinbaseSocket = openCoinbaseWs(currentTokenPair.base, currentTokenPair.quote)
        let crypto_comSocket = openCrypto_comWs(currentTokenPair.base, currentTokenPair.quote)
        let krakenSocket = openKrakenWs(currentTokenPair.base, currentTokenPair.quote)
        let jupiterHttpLoop = openJupiterHttp(currentTokenPair.base, currentTokenPair.quote)
        let oneInchHttpLoop = openOneInchHttp(currentTokenPair.base, currentTokenPair.quote)

        let wsExchanges: ExConnections = {
            binance: binanceSocket,
            kraken: bybitSocket,
            coinbase: coinbaseSocket,
            crypto_com: crypto_comSocket,
            bybit: krakenSocket,
            jupiter: jupiterHttpLoop,
            oneInch: oneInchHttpLoop,
        }
        //store the connections
        TokenPairConnections[tokenPairString] = wsExchanges;

        TokenPairPrices[tokenPairString] = initializePriceObject()
        PreviousPrices[tokenPairString] = initializePriceObject()
    }
}

//Calls APIs to get the current price on each exchange
const getCurrentPrices = (base: string, quote: string) => {
    getCurrentBinancePrice(base, quote)
    getCurrentKrakenPrice(base, quote)
    getCurrentOneInchPrice(base, quote)
    getCurrentJupiterPrice(base, quote)
    getCurrentBybitPrice(base, quote)
    getCurrentCrypto_comPrice(base, quote)
    getCurrentCoinbasePrice(base, quote)
}