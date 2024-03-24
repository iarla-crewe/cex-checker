"use strict";
exports.__esModule = true;
//Receive input and output tokens and exchange list from user (http endpoint)
// Import necessary modules
var express = require('express');
var WebSocket = require('ws');
// Create an Express application
var app = express();
var port = 3000;
// Middleware to parse JSON bodies
app.use(express.json());
// Define a POST endpoint to receive data from the client
app.post('/send-data', function (req, res) {
    var data = req.body; // Access the data sent by the client
    // Process the received data here
    console.log('Received data:', data);
    res.send('Data received successfully'); // Send a response back to the client
});
// // Start the server
// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });
//get price data (websocket)
var binanceWebSocketUrl = 'wss://stream.binance.com:9443';
var webSocket = new WebSocket(binanceWebSocketUrl);
webSocket.on('open', function () {
    console.log('WebSocket connection established');
    // Subscribe to a particular stream, for example, the BTC/USDT price ticker
    var subscribeMsg = JSON.stringify({
        "method": "SUBSCRIBE",
        "params": [
            "btcusdt@aggTrade",
            "btcusdt@depth"
        ],
        "id": 1
    });
    webSocket.send(subscribeMsg);
});
webSocket.on('message', function (data) {
    console.log('Received message:', data.toString());
});
webSocket.on('close', function (code, reason) {
    console.log("WebSocket connection closed, code: ".concat(code, ", reason: ").concat(reason));
});
webSocket.on('error', function (error) {
    console.error('WebSocket error:', error.message);
});
//get fee data (database)
//calculate estimated output
//Send output to client continously via (websocket)
