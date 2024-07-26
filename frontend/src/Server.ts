import express from 'express';
import { readFileSync } from 'fs';
import { createServer } from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const options = {
  key: readFileSync(path.join(__dirname, "../../client-key.pem")),
  cert: readFileSync(path.join(__dirname, "../../client-cert.pem")),
};

const httpsServer = createServer(options, app);

const port = 443;

httpsServer.listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});
