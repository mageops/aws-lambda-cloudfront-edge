'use strict';

const isSupported = require('./lib/isSupported');

const fetch = require('./lib/fetch/middleware');
const brotli = require('./lib/brotli/middleware');
const gzip = require('./lib/gzip/middleware');
const imagemin = require('./lib/imagemin/middleware');
const webp = require('./lib/webp/middleware');
const limitSize = require('./lib/limitSize/middleware');

/**
 * Origin Request CloudFront event handler.
 */
exports.handler = async (event, context, callback) => {
    const request = event.Records[0].cf.request;

    if (!isSupported(request)) {
        callback(null, request);
    }

    return fetch({ request })
        .then(webp)
        .then(imagemin)
        .then(brotli)
        .then(gzip)
        .then(limitSize)
        .then(({ response }) => {
            callback(null, response);
        })
        .catch(() => {
            callback(null, request);
        });
};
