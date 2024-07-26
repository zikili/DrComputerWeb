mport express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'https';
import { readFileSync } from 'fs';

const app = express();
const port = 443; // Default port for HTTPS

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));
console.log(`Serving static files from: ${path.join(__dirname, 'src')}`);

// Handle other routes (you can customize this based on your needs)
app.get('/', (req, res) => {
  res.send('Welcome to My Application');
});

// HTTPS options including certificate and key
const options = {
  key: readFileSync(path.join(__dirname, '../../client-key.pem')),
  cert: readFileSync(path.join(__dirname, '../../client-cert.pem')),
};

// Create an HTTPS server
const httpsServer = createServer(options, app);

// Start the HTTPS server
httpsServer.listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});