import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import fs from 'fs';

const app = express();
const port = 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SSL certificate and key
const options = {
  key: fs.readFileSync('path/to/your/ssl.key'),
  cert: fs.readFileSync('path/to/your/ssl.cert')
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
