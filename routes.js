const routes = require('next-routes');
    
module.exports = routes()
  .add('campaigns/create', '/campaigns/create')
  .add('campaigns/details', '/campaigns/:address')
  .add('campaigns/requests/index', '/campaigns/:address/requests')
  .add('campaigns/requests/create', '/campaigns/:address/requests/create')