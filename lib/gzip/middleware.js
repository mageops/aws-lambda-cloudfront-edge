// @ts-check

const isGzipSupported = require('./isSupported');
const isBrotliSupported = require('../brotli/isSupported');
const { isError, convertHeaders } = require('../responseHelper');
const logger = require('../logger');

/**
 * Fetches requested resource and compresses it with gzip.
 * Compression is only applied if gzip is supported and brotli is not.
 *
 * @param {object} request Request object.
 * @param {object} response Response object.
 * @returns {Promise<object>} Response object.
 */
module.exports = async (request, response = null) => {
    if (
        !isGzipSupported(request) ||
        isBrotliSupported(request) ||
        isError(response)
    ) {
        return response;
    }

    const got = require('got');
    const getOriginUrl = require('../getOriginUrl');
    const gzipCompress = require('./compress');

    const originUrl = getOriginUrl(request);
    logger.log(`Fetching file for gzip from ${originUrl}`);

    const originResponse = await got(originUrl);
    const compressedBuffer = await gzipCompress(originResponse.body);

    if (compressedBuffer.length > 1003520) {
        logger.log(
            `Compressed response body size(${
                compressedBuffer.length
            }B) exceeds limit, skipping.`
        );
        return response;
    }

    response = response || {};
    response = {
        ...response,
        status: originResponse.statusCode,
        statusDescription: originResponse.statusMessage,
        body: compressedBuffer.toString('base64'),
        headers: {
            ...convertHeaders(originResponse.headers),
            ...{
                'content-encoding': [
                    { key: 'Content-Encoding', value: 'gzip' },
                ],
                'content-type': [
                    {
                        key: 'Content-Type',
                        value: originResponse.headers['content-type'],
                    },
                ],
                'x-orig-size': [
                    {
                        key: 'X-Orig-Size',
                        value: originResponse.body.length,
                    },
                ],
            },
        },
        bodyEncoding: 'base64',
    };

    return response;
};
