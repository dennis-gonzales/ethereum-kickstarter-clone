const routes = require('next-routes')();
    
routes
  .add('/campaigns/create', '/campaigns/create')
  .add('/campaigns/:address', '/campaigns/details')
  .add('/campaigns/:address/requests', '/campaigns/requests/index')
  .add('/campaigns/:address/requests/create', '/campaigns/requests/create');

  module.exports = routes;