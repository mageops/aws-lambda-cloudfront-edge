'use strict';

const ware = require('ware');

const brotli = require('./lib/brotli/middleware');
const gzip = require('./lib/gzip/middleware');
const imagemin = require('./lib/imagemin/middleware');

const middleware = ware()
    .use(brotli)
    .use(gzip)
    .use(imagemin);

/**
 * Origin Request CloudFront event handler.
 */
exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const response = event.Records[0].cf.response;
    console.log(typeof response.body, response.body);
    middleware.run(request, response, (error, request, response) => {
        callback(error, response);
    });
};
