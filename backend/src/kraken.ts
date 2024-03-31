import axios from 'axios';
import crypto from 'crypto';
import WebSocket from 'ws';
import { minusFees, sortPrices } from './prices.js';
import { binancePrice } from './binance.js';

export let krakenPrice: string;

let krakenDepoistFee = {
    sol: 0
}
let krakenWithdrawFee = {
    usdc: 1
}
let krakenMakerFee: number = 0.0024;
let krakenTakerFee: number = 0.004;

//example code: https://support.kraken.com/hc/en-us/articles/4413834730260-Example-code-for-NodeJs-REST-and-WebSocket-API

export const getKrakenPrice = async (inputToken: string, outputToken: string, inputAmount: number) => {

    //TODO: UPDATE WITH YOUR KEYS :)
    let apiPublicKey = "EwS5M0YFHRsM3a4UqWicIY161mMM8iL0F3BPxGIDhtU1GSgk9BMDBg7g"
    let apiPrivateKey = "btdWLH9Gldbme2fL4l0oe1hAfQ8grwC"

    //convert usdc into usd or usdt
    outputToken = outputToken.slice(0, -1) + "t";


    try {
        /*
        * PUBLIC WEBSOCKET Examples
        */


        let publicWebSocketURL = "wss://ws.kraken.com/";
        let publicWebSocketSubscriptionMsg = `{ "event":"subscribe", "subscription":{"name":"trade"},"pair":["${inputToken.toUpperCase()}/${outputToken.toUpperCase()}"] }`;

        /*
        *MORE PUBLIC WEBSOCKET EXAMPLES
        
        let publicWebSocketSubscriptionMsg = "{ "event": "subscribe", "subscription": { "interval": 1440, "name": "ohlc"}, "pair": [ "XBT/EUR"]}";
        let publicWebSocketSubscriptionMsg = "{ "event": "subscribe", "subscription": { "name": "spread"}, "pair": [ "XBT/EUR","ETH/USD" ]}";
        */

        await OpenAndStreamWebSocketSubscription(publicWebSocketURL, publicWebSocketSubscriptionMsg);


        /*
        * PRIVATE WEBSOCKET Examples
        */

        // if (option == 4) {

        //     let privateWebSocketURL = "wss://ws-auth.kraken.com/";

        //     //GET THE WEBSOCKET TOKEN FORM THE JSON RESPONSE 
        //     let webSocketToken = await QueryPrivateEndpoint("GetWebSocketsToken", "", apiPublicKey, apiPrivateKey);
        //     webSocketToken = webSocketToken['token'];

        //     /*
        //     *MORE PRIVATE WEBSOCKET EXAMPLES

        //     let privateWebSocketSubscriptionMsg = `{ "event": "subscribe", "subscription": { "name": "openOrders", "token": "${webSocketToken}"}}`;
        //     let privateWebSocketSubscriptionMsg = `{ "event": "subscribe", "subscription": { "name": "balances", "token": "${webSocketToken}"}}`;
        //     let privateWebSocketSubscriptionMsg = `{"event":"addOrder","reqid":1234,"ordertype":"limit","pair":"XBT/EUR","token":"${webSocketToken}","type":"buy","volume":"1", "price":"1.00"}`;
        //     */

        //     //REPLACE PLACEHOLDER WITH TOKEN
        //     let privateWebSocketSubscriptionMsg = `{ "event": "subscribe", "subscription": { "name": "ownTrades", "token": "${webSocketToken}"}}`;

        //     await OpenAndStreamWebSocketSubscription(privateWebSocketURL, privateWebSocketSubscriptionMsg);
        // }

    }
    catch (e) {
        console.log();
        console.log("AN EXCEPTION OCCURED :(");
        console.log(e);
    }


    /*
    * Public REST API Endpoints
    */

    async function QueryPublicEndpoint(endPointName: string, inputParameters: any) {
        let jsonData;
        const baseDomain = "https://api.kraken.com";
        const publicPath = "/0/public/";
        const apiEndpointFullURL = baseDomain + publicPath + endPointName + "?" + inputParameters;

        jsonData = await axios.get(apiEndpointFullURL);
        return jsonData.data.result;
    }


    /*
    * Private REST API Endpoints
    */

    async function QueryPrivateEndpoint(endPointName: string,
        inputParameters: string,
        apiPublicKey: string,
        apiPrivateKey: string) {
        const baseDomain = "https://api.kraken.com";
        const privatePath = "/0/private/";

        const apiEndpointFullURL = baseDomain + privatePath + endPointName;
        const nonce = Date.now().toString();
        const apiPostBodyData = "nonce=" + nonce + "&" + inputParameters;

        const signature = CreateAuthenticationSignature(apiPrivateKey,
            privatePath,
            endPointName,
            nonce,
            apiPostBodyData);

        const httpOptions =
        {
            headers: { 'API-Key': apiPublicKey, 'API-Sign': signature }
        };

        let jsonData = await axios.post(apiEndpointFullURL, apiPostBodyData, httpOptions);

        return jsonData.data.result;
    }


    /*
    * Authentication Algorithm
    */

    function CreateAuthenticationSignature(apiPrivateKey: string,
        apiPath: string,
        endPointName: string,
        nonce: string,
        apiPostBodyData: string) {

        const apiPost = nonce + apiPostBodyData;
        const secret = Buffer.from(apiPrivateKey, 'base64');
        const sha256 = crypto.createHash('sha256');
        const hash256 = sha256.update(apiPost).digest('binary');
        const hmac512 = crypto.createHmac('sha512', secret);
        const signatureString = hmac512.update(apiPath + endPointName + hash256, 'binary').digest('base64');
        return signatureString;
    }


    /*
    * WebSocket API
    */

    async function OpenAndStreamWebSocketSubscription(connectionURL: string, webSocketSubscription: any) {
        try {
            const webSocketClient = new WebSocket(connectionURL);

            webSocketClient.on('open', function open() {
                webSocketClient.send(webSocketSubscription);
            });

            webSocketClient.on('message', function incoming(wsMsg) {
                let priceObject = JSON.parse(wsMsg.toString())


                if (wsMsg.toString() != '{"event":"heartbeat"}' && priceObject.event != "systemStatus" && priceObject.event != "subscriptionStatus") {
                    krakenPrice = priceObject

                    // Iterate through each nested array
                    for (const innerArray of priceObject[1]) {
                        // Access the first element (price) of the inner array
                        krakenPrice = minusFees(innerArray[0], krakenTakerFee, inputAmount)

                        sortPrices(binancePrice, krakenPrice)
                    }
                }
            });

            webSocketClient.on('close', function close() {
                console.log("|==============================================|");
                console.log("|     END OF PROGRAM - HAVE A GOOD DAY :)      |");
                console.log("|==============================================|");
                console.log("\n");
            });

        }
        catch (e) {
            console.log();
            console.log("AN EXCEPTION OCCURED :(");
            console.log(e);
        }
    }
};