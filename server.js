const express = require('express');
const server = express();
server.timeout = 1000;

server.use(require('compression')());

server.get('/favicon.ico', (req, res) => res.status(200).redirect('https://cdn.ravencode.live/favicon.ico'));
server.listen(process.env.PORT || 8000, () => console.log("Server started."));
process.on('uncaughtException', console.log);

server.use('*', (req, res, next) => {
  if (req.headers.host !== 'ravn.tk') return res.redirect('https://ravn.tk');
  else next();
});
server.get('/ping', (req, res) => res.status(200).send('OK'));

const redirects = require('./redirects.json');
server.get('/:path', (req, res) => {
  const path = req.params.path;
  const redirect = redirects[path];
  if (redirect) res.status(200).redirect(redirect);
  else res.status(200).redirect('https://ravencode.live/' + path)
});

server.get('/', (req, res) => res.status(200).send('OK'));
server.use('*', (req, res) => res.status(404).send("Not found."));
setInterval(() => require('http').get('http://ravn-tk/ping'), 300000);
