/**
 * express goes here
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const apiRoute = require('./routes/route');
const adminCheck = require('./lib/adminCheck');

adminCheck();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', apiRoute);
app.use(express.static(path.join(__dirname, '..', 'client', 'dist', 'index.html'))); // this must be done by nginx

module.exports = app;
