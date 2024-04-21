//Receive input and output tokens and exchange list from user (http endpoint)
// Import necessary modules
// const express = require('express');
import express, { Request, Response } from 'express';
import http from 'http'
import { Server } from "socket.io";

// Create an Express application
const app = express();
const APIport = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Define a POST endpoint to receive data from the client
app.post('/get-best-price', (req: Request, res: Response) => {
    const data = req.body; // Access the data sent by the client

    // Process the received data here
    console.log('Received data:', data);

    res.send('Data received successfully'); // Send a response back to the client
});

// Start the server
app.listen(APIport, () => {
    console.log(`Server running at http://localhost:${APIport}`);
});