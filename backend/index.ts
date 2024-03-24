//Receive input and output tokens and exchange list from user (http endpoint)
// Import necessary modules
const express = require('express');
import { Request, Response } from 'express';
const WebSocket = require('ws');

// Create an Express application
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define a POST endpoint to receive data from the client
app.post('/send-data', (req: Request, res: Response) => {
    const data = req.body; // Access the data sent by the client

    // Process the received data here
    console.log('Received data:', data);

    res.send('Data received successfully'); // Send a response back to the client
});

// // Start the server
// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });



//get price data (websocket)
const binanceWebSocketUrl = 'wss://stream.binance.com:9443';

const webSocket = new WebSocket(binanceWebSocketUrl);

webSocket.on('open', () => {
    console.log('WebSocket connection established');

    // Subscribe to a particular stream, for example, the BTC/USDT price ticker
    const subscribeMsg = JSON.stringify({
        "method": "SUBSCRIBE",
        "params":
        [
        "btcusdt@aggTrade",
        "btcusdt@depth"
        ],
        "id": 1
        }
        
        );

    webSocket.send(subscribeMsg);
});

webSocket.on('message', (data: any) => {
    console.log('Received message:', data.toString());
});

webSocket.on('close', (code: number, reason: string) => {
    console.log(`WebSocket connection closed, code: ${code}, reason: ${reason}`);
});

webSocket.on('error', (error: Error) => {
    console.error('WebSocket error:', error.message);
});

//get fee data (database)

//calculate estimated output

//Send output to client continously via (websocket)

