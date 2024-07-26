import express from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Get the directory name from the URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'build')));
console.log(path.join(__dirname, 'build'));

app.get('*', (_req, res) => {
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
