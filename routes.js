const routes = require('next-routes');

module.exports = routes()
    .add('/campaigns/create', '/campaigns/create')
    .add('/campaigns/:address', '/campaigns/details');