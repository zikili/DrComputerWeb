const express = require('express');
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
