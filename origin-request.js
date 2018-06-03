'use strict';

const brotli = require('./lib/brotli/middleware');
const gzip = require('./lib/gzip/middleware');
// const imagemin = require('./lib/imagemin/middleware');

const middleware = [gzip, brotli];

/**
 * Origin Request CloudFront event handler.
 */
exports.handler = async (event, context, callback) => {
    const request = event.Records[0].cf.request;
    console.log(JSON.stringify(request));
    let response = null;

    try {
        for (let i = 0; i < middleware.length; i++) {
            const middlewareResponse = await middleware[i](request, response);
            if (middlewareResponse) {
                response = middlewareResponse;
            }
        }
    } catch (error) {
        console.error(error);
        response = {
            body: '',
            status: error.statusCode,
            statusDescription: error.statusMessage,
        };
    }

    // Bypass lambda if it didn't generate any response by passing request object.
    if (response === null) {
        response = request;
    }

    callback(null, response);
};
