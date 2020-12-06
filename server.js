const next = require('next');
const express = require('express')
const routes = require('./routes');
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  express().use(handler).listen(3000, (err) => {
        if (err) throw err;
        else console.log('started server on http://localhost:3000');
    })
})