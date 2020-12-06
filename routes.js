const routes = require('next-routes');

module.exports = routes()
    .add({
        name: '/campaigns/create',
        pattern: '/campaigns/create',
        page: '/campaigns/create'
    })
    .add({
        name: '/campaigns/details',
        pattern: '/campaigns/:address',
        page: '/campaigns/details'
    })
    .add({
        name: '/campaigns/requests/index',
        pattern: '/campaigns/:address/requests',
        page: '/campaigns/requests/index'
    })
    .add({
        name: '/campaigns/requests/create',
        pattern: '/campaigns/:address/requests/create',
        page: '/campaigns/requests/create'
    });