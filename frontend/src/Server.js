import express from 'express';
import { readFileSync } from 'fs';
import { createServer } from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Use express.static to serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));
console.log(path.join(__dirname, 'build'));

// Handle all other routes by sending the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// HTTPS options including certificate and key
const options = {
  key: readFileSync(path.join(__dirname, "../../client-key.pem")),
  cert: readFileSync(path.join(__dirname, "../../client-cert.pem")),
};

// Create an HTTPS server
const httpsServer = createServer(options, app);

// Define the port number
const port = 443;

// Start the HTTPS server
httpsServer.listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});
