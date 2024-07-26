import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'https';
import { readFileSync } from 'fs';

const app = express();
const port = 443; // Default port for HTTPS

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
console.log(`Serving static files from: ${path.join(__dirname, 'public')}`);

// Handle all other routes by sending the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// HTTPS options including certificate and key
const options = {
  key: readFileSync(path.join(__dirname, '../../path/to/your/client-key.pem')),
  cert: readFileSync(path.join(__dirname, '../../path/to/your/client-cert.pem')),
};

// Create an HTTPS server
const httpsServer = createServer(options, app);

// Start the HTTPS server
httpsServer.listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});
/*
  GNU nano 7.2                                                                                                      Server.js                                                                                                                const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));
console.log(path.join(__dirname, 'build'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const options = {
  key: fs.readFileSync(path.join(__dirname, "../../client-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../../client-cert.pem")),
};

const credentials = { key: options.key, cert: options.cert };

const httpsServer = https.createServer(credentials, app);

const port = process.env.SERVER_PORT || 443;

httpsServer.listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});
*/