const WebSocketClient = require('ws');

const binanceWebSocketUrl = 'wss://stream.binance.com:9443/ws/solusdt@avgPrice';

const socket = new WebSocketClient(binanceWebSocketUrl);

socket.onopen = () => {
    socket.send(JSON.stringify({
        "method": "SUBSCRIBE",
        "params":
        [
        "solusdt@avgPrice",
        ],
        "id": 1
        }))
}

socket.onmessage = ({data}: any) => {
    console.log("Message from the server: ", data)
};

socket.on('close', (code: number, reason: string) => {
    console.log(`WebSocket connection closed, code: ${code}, reason: ${reason}`);
});

socket.on('error', (error: Error) => {
    console.error('WebSocket error:', error.message);
});
