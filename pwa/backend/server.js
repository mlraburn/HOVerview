/*
Backend server for handling the API call and dealing with CORS issues
 */

// import packages
// must add "type": "module" to package.json to support imports

// external packages for API calls
import express from 'express';
import axios from 'axios';
import cors from 'cors';

// base packages
import { fileURLToPath } from 'url';  // base node.js
import path from 'path';  // base node.js

// get filename and directory name
// need this because using imports doesn't give these values
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// global variables
const API_URL = 'https://www.expresslanes.com/maps-api/lane-status';

// create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// When front end browser goes here then run the code
app.get('/lane-status', async (req, res) => {
    try {
        // Make the API request to the express lanes
        const response = await axios.get(API_URL);

        const data = response.data;

        res.json({
            direction: data.road95and395,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error fetching express lanes data:', error);

        // Return error to client
        res.status(500).json({
            error: 'Failed to fetch express lanes direction';
            message: error.message;
        });
    }
});