import { calculatePrice, emitPrices } from "../emit.js";
import { ExchangeFees, Prices } from "../types.js";
import WebSocket from 'ws';

export let exchangeTakerFees: ExchangeFees = {
    binance: 0.001,
    kraken: 0.004,
    coinbase: 0,
    crypto_com: 0,
    bybit: 0.001
}

export let exchangeMakerFees: ExchangeFees = {
    binance: 0.001,
    kraken: 0.0024,
    coinbase: 0,
    crypto_com: 0,
    bybit: 0.001
}

export let prices: Prices = {
    binance: "",
    kraken: "",
    coinbase: "",
    crypto_com: "",
    bybit: ""
};


export const getExchangePrices = (binanceSocket: WebSocket, krakenSocket: WebSocket, bybitSocket: WebSocket) => {

    let prices: Prices = {
        binance: "",
        kraken: "",
        coinbase: "",
        crypto_com: "",
        bybit: ""
    };

    binanceSocket.onmessage = ({ data }: any) => {
        let priceObject = JSON.parse(data)
        prices.binance = calculatePrice(priceObject.p, exchangeTakerFees.binance)
        emitPrices(prices)
    };

    krakenSocket.on('message', function incoming(wsMsg) {
        let priceObject = JSON.parse(wsMsg.toString())

        if (wsMsg.toString() != '{"event":"heartbeat"}' && priceObject.event != "systemStatus" && priceObject.event != "subscriptionStatus") {
            // Iterate through each nested array
            for (const innerArray of priceObject[1]) {
                // Access the first element (price) of the inner array
                prices.kraken = calculatePrice(innerArray[0], exchangeTakerFees.kraken)
                emitPrices(prices)
            }
        }
    });

    bybitSocket.onmessage = ({ data }: any) => {
        let priceObject = JSON.parse(data)
        try {
            prices.bybit = calculatePrice(priceObject.data[0].p, exchangeTakerFees.bybit)
            console.log("Bybit price: ", prices.bybit)
        } catch (error) {
            console.log("Bybit data object does not contain a price")
        }
        emitPrices(prices)
    };
}