const next = require('next');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  const server = express();
  
  server.use(bodyParser.urlencoded({ extended: true }))
  server.use(bodyParser.json())
  server.use(handler).listen(3000, (err) => {
        if (err) throw err;
        else console.log('started server on http://localhost:3000');
    })
})