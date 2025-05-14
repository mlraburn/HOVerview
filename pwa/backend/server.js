/*
Backend server for handling the API call and dealing with CORS issues
 */

const express = require('express');

const API_URL = 'https://www.expresslanes.com/maps-api/lane-status';

const app = express();

// When front end browser goes here then run the code
app.get('/lane-status', async (req, res) => {

});