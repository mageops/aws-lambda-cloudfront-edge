// @ts-check

const isGzipSupported = require('./isSupported');
const isBrotliSupported = require('../brotli/isSupported');

/**
 * Fetches requested resource and compresses it with gzip.
 * Compression is only applied if gzip is supported and brotli is not.
 *
 * @param {object} request Request object.
 * @param {object} response Response object.
 * @param {function} next Callback to trigger next middleware.
 */
module.exports = async (request, response, next) => {
    if (!isGzipSupported(request) || isBrotliSupported(request)) {
        next();
        return;
    }

    const got = require('got');
    const getOriginUrl = require('../getOriginUrl');
    const gzipCompress = require('./compress');

    try {
        const originUrl = getOriginUrl(request);
        console.log(`Fetching file for gzip from ${originUrl}`);
        const originResponse = await got(originUrl);
        const compressedBuffer = await gzipCompress(originResponse.body);
        response.body = compressedBuffer.toString('base64');
        response.headers['content-encoding'] = [
            { key: 'Content-Encoding', value: 'gzip' },
        ];
        response.bodyEncoding = 'base64';
    } catch (error) {
        console.error(error.response.body);
        Object.assign(response, error.response);
    }

    next();
};
