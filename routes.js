const routes = require('next-routes');

module.exports = routes()
    .add({
        name: 'campaign-create',
        pattern: '/campaign/create',
        page: '/campaigns/create'
    })
    .add({
        name: 'campaign-details',
        pattern: '/campaign/:address',
        page: '/campaigns/details'
    })
    .add({
        name: 'campaign-spending-requests',
        pattern: '/campaign/:address/requests',
        page: '/campaigns/requests/index'
    });