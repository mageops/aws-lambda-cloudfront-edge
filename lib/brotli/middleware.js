// @ts-check

const isBrotliSupported = require('./isSupported');

/**
 * Fetches and compresses requested resource with brotli algorithm.
 * Compression is only applied if supported by the client.
 *
 * @param {object} request Request object.
 * @param {object} response Response object.
 * @param {function} next Callback to trigger next middleware.
 */
module.exports = async (request, response, next) => {
    if (!isBrotliSupported(request)) {
        next();
        return;
    }

    const got = require('got');
    const getOriginUrl = require('../getOriginUrl');
    const brotliCompress = require('./compress');

    try {
        const originUrl = getOriginUrl(request);
        console.log(`Fetching file for brotli from ${originUrl}`);
        const originResponse = await got(originUrl);
        const compressedBuffer = await brotliCompress(originResponse.body);
        response.body = compressedBuffer.toString('base64');
        response.headers['content-encoding'] = [
            { key: 'Content-Encoding', value: 'br' },
        ];
        response.bodyEncoding = 'base64';
    } catch (error) {
        console.error(error);
        Object.assign(response, error.response);
    }

    next();
};
