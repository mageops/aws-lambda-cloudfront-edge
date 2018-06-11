// @ts-check

const isBrotliSupported = require('./isSupported');
const { isError } = require('../responseHelper');
const logger = require('../logger');

/**
 * Fetches and compresses requested resource with brotli algorithm.
 * Compression is only applied if supported by the client.
 *
 * @param {object} request Request object.
 * @param {object} response Response object.
 * @returns {Promise<object>} Response object.
 */
module.exports = async (request, response = null) => {
    if (!isBrotliSupported(request) || isError(response)) {
        return response;
    }

    const got = require('got');
    const getOriginUrl = require('../getOriginUrl');
    const brotliCompress = require('./compress');

    response = response || {};
    const originUrl = getOriginUrl(request);
    logger.log(`Fetching file for brotli from ${originUrl}`);

    const originResponse = await got(originUrl);
    const compressedBuffer = await brotliCompress(originResponse.body);
    response = {
        ...response,
        status: originResponse.statusCode,
        statusDescription: originResponse.statusMessage,
        body: compressedBuffer.toString('base64'),
        headers: {
            ...originResponse.headers,
            ...{
                'content-encoding': [{ key: 'Content-Encoding', value: 'br' }],
                'content-type': [
                    {
                        key: 'Content-Type',
                        value: originResponse.headers['content-type'],
                    },
                ],
            },
        },
        bodyEncoding: 'base64',
    };
    logger.log(response);

    return response;
};
