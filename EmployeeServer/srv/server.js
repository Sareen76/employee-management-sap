const cds = require('@sap/cds');

cds.on('bootstrap', (app) => {
    const cov2ap = require('@cap-js-community/odata-v2-adapter');
    app.use(cov2ap(/* { path: 'odata/v2', base: '' } */));
})

module.exports = cds.server;