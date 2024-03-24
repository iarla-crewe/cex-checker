//Receive input and output tokens and exchange list from user (http endpoint)
// Import necessary modules
const express = require('express');
import { Request, Response } from 'express';

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

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


// //get fee data (database)

// //calculate estimated output

// //Send output to client continously via (websocket)

