import WebSocket from "ws";
import { TokenPairPrices } from "../index.js";
import { PairStatus } from "../types.js";

export const openBackpackWs = (baseToken: string, quoteToken: string) => {
    const backpackWebSocketUrl = 'wss://ws.backpack.exchange/';

    const backpackSocket = new WebSocket(backpackWebSocketUrl);

    backpackSocket.onopen = () => {
        backpackSocket.send(JSON.stringify({
            "method": "SUBSCRIBE",
            "params": [`trade.${baseToken.toUpperCase()}_${quoteToken.toUpperCase()}`]
        }))
    }

    backpackSocket.onmessage = ({ data }: any) => {
        let priceObject = JSON.parse(data)

        if (priceObject.id === null || priceObject.error != undefined) {
            TokenPairPrices[`${baseToken}/${quoteToken}`].backpack = PairStatus.NoPairFound
            console.log("Token pair not supported by backpack")
        } else {
            try {
                TokenPairPrices[`${baseToken}/${quoteToken}`].backpack = parseFloat(priceObject.data.p)
                console.log("Backpack price: ", priceObject.data.p)

            } catch (error) {
                console.log("[Error] Backpack.exchange data object does not contain a price:", priceObject, ", error: ", error)
            }
        }
    };

    backpackSocket.on('close', (code: number, reason: string) => {
        console.log(`Backpack.exchange webSocket connection closed, code: ${code}, reason: ${reason}`);
    });

    backpackSocket.on('error', (error: Error) => {
        console.error('[Error] Backpack.exchange webSocket:', error.message);
    });

    return backpackSocket;
}

export const getCurrentBackpackPrice = async (baseToken: string, quoteToken: string) => {
    let tokenPairString = `${baseToken}/${quoteToken}`
    const API_URL = `https://api.backpack.exchange/api/v1/trades?symbol=${baseToken.toUpperCase()}_${quoteToken.toUpperCase()}&limit=1`;

    let data;
    try {
        const response = await fetch(API_URL, {
            method: "GET"
        });

        data = await response.json();
    } catch (error) {
        TokenPairPrices[tokenPairString].backpack = PairStatus.NoPairFound
        console.error("Token pair not found in backpack");
    }

    let price: number;
    try {
        price = Number(data[0].price);
    } catch (error) {
        console.log("[Error] Backpack.exchange API call")
        TokenPairPrices[tokenPairString].backpack = PairStatus.NoPairFound

        return
    }
    TokenPairPrices[tokenPairString].backpack = price

    return
}

//openBackpackWs("sol", "usdc")