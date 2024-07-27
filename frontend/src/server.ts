import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import fs from 'fs';

const app = express();
const port = 443;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SSL certificate and key
const options = {
  key: fs.readFileSync("../../myprefx-client-key.pem"),
  cert: fs.readFileSync("../../myprefix-client-cert.pem")
};

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Handle all other routes and serve the index.html file
app.get('*', (req, res) => {
    console.log(req)
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

https.createServer(options, app).listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});