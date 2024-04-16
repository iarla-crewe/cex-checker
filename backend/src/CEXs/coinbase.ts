import WebSocket from "ws";
import { calculatePrice, emitPrices } from "../emit.js";
import { binancePrice } from "./binance.js";
import { krakenPrice } from "./kraken.js";
import * as crypto from 'crypto';
import * as base64 from 'base-64';
import * as utf8 from 'utf8';

export let coinbasePrice: string;

let coinbaseDepoistFee = {
    sol: 0
}
let coinbaseWithdrawFee = {
    usdc: 4
}
let coinbaseMakerFee: number = 0.001;
let coinbaseTakerFee: number = 0.001;

// export const getCoinbasePrice = (inputToken: string, outputToken: string, inputAmount: number) => {
//     const coinbaseWebSocketUrl = 'wss://ws-feed.exchange.coinbase.com';

//     const coinbaseSocket = new WebSocket(coinbaseWebSocketUrl);

//     let signature_b64: string, timestamp = await generateSignature()
    
//     coinbaseSocket.onopen = () => {
//         coinbaseSocket.send(JSON.stringify({
//             'type': 'subscribe',
//             'channels': [{'name': "level2", 'product_ids': ["SOL-USD"]}],
//             'signature': signature_b64,
//             'key': API_KEY,
//             'passphrase': PASSPHRASE,
//             'timestamp': timestamp
//             })
//         )
//     }
    
//     coinbaseSocket.onmessage = ({data}: any) => {
//         let priceObject = JSON.parse(data)
//         console.log("Price object: ", priceObject)
//         // coinbasePrice = minusFees(priceObject.p, coinbaseTakerFee, inputAmount)
        
//         // sortPrices(coinbasePrice, krakenPrice);
//     };
    
//     coinbaseSocket.on('close', (code: number, reason: string) => {
//         console.log(`WebSocket connection closed, code: ${code}, reason: ${reason}`);
//     });
    
//     coinbaseSocket.on('error', (error: Error) => {
//         console.error('WebSocket error:', error.message);
//     });
    
// }


// async function generateSignature(): Promise<[string, string]> {
//     const timestamp: string = String(Date.now() / 1000);
//     const message: string = `${timestamp}GET/users/self/verify`;
//     const hmacKey: Buffer = Buffer.from(SECRET_KEY, 'base64');
//     const signature: Buffer = crypto.createHmac('sha256', hmacKey)
//                                     .update(utf8.encode(message))
//                                     .digest();
//     const signatureB64: string = base64.encode(signature).replace(/\n|\r/g, '');
//     return [signatureB64, timestamp];
// }