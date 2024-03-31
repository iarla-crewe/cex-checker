const WebSocketClientNew = require('ws');
const cryptoPakage = require('crypto');

const api_secret = "";
const api_key = ""

// Generate expires.
const expires: number = Math.floor((Date.now() / 1000) + 1) * 1000;

// Generate signature.
const signature: string = cryptoPakage.createHmac('sha256', api_secret)
    .update(`GET/realtime${expires}`)
    .digest('hex');


const bybitWebSocketUrl = 'wss://stream.bybit.com/v5/private';

const bybitSocket = new WebSocketClientNew(bybitWebSocketUrl);

bybitSocket.onopen = () => {
    // bybitSocket.send(JSON.stringify({
    //     op: "auth",
    //     args: [api_key, expires, signature]
    // }))
    bybitSocket.send(JSON.stringify({"req_id": "100001", "op": "ping"}));
}

bybitSocket.onmessage = ({data}: any) => {
    console.log("Message from the server: ", data)
};

bybitSocket.on('close', (code: number, reason: string) => {
    console.log(`WebSocket connection closed, code: ${code}, reason: ${reason}`);
});

bybitSocket.on('error', (error: Error) => {
    console.error('WebSocket error:', error.message);
});
