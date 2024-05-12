import { ConnectionsNumber, PreviousPrices, TokenPairConnections, TokenPairPrices } from "../index.js";
import { openBinanceWs } from "../CEXs/binance.js";
import { openBybitWs } from "../CEXs/bybit.js";
import { openCoinbaseWs } from "../CEXs/coinbase.js";
import { openCrypto_comWs } from "../CEXs/crypto-com.js";
import { openKrakenWs } from "../CEXs/kraken.js";
import { PairStatus, TokenPair, WsConnections } from "../types.js";

export const initializeObject = () => {
    return {
        binance: undefined,
        kraken: undefined,
        coinbase: undefined,
        crypto_com: undefined,
        bybit: undefined
    }
}

export const initializePriceObject = () => {
    return {
        binance: PairStatus.Loading,
        kraken: PairStatus.Loading,
        coinbase: PairStatus.Loading,
        crypto_com: PairStatus.Loading,
        bybit: PairStatus.Loading
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
    ConnectionsNumber[previousPairString] -= 1;
    if (ConnectionsNumber[previousPairString] <= 0) {
        //close the websockets stored for that tokenpair
        TokenPairConnections[previousPairString]?.binance?.close()
        TokenPairConnections[previousPairString]?.bybit?.close()
        TokenPairConnections[previousPairString]?.coinbase?.close()
        TokenPairConnections[previousPairString]?.crypto_com?.close()
        TokenPairConnections[previousPairString]?.kraken?.close()

        TokenPairConnections[previousPairString] = undefined
    }
}

export const openExchangeWsConnections = (currentTokenPair: TokenPair) => {
    const tokenPairString = `${currentTokenPair.base}/${currentTokenPair.quote}`

    if (TokenPairConnections[tokenPairString] == undefined) {
        let binanceSocket = openBinanceWs(currentTokenPair.base, currentTokenPair.quote)
        let bybitSocket = openBybitWs(currentTokenPair.base, currentTokenPair.quote)
        let coinbaseSocket = openCoinbaseWs(currentTokenPair.base, currentTokenPair.quote)
        let crypto_comSocket = openCrypto_comWs(currentTokenPair.base, currentTokenPair.quote)
        let krakenSocket = openKrakenWs(currentTokenPair.base, currentTokenPair.quote)

        let wsExchanges: WsConnections = {
            binance: binanceSocket,
            kraken: bybitSocket,
            coinbase: coinbaseSocket,
            crypto_com: crypto_comSocket,
            bybit: krakenSocket,
        }
        //store the connections
        TokenPairConnections[tokenPairString] = wsExchanges;

        TokenPairPrices[tokenPairString] = initializePriceObject()
        PreviousPrices[tokenPairString] = initializePriceObject()
    }
}