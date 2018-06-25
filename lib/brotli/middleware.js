// @ts-check

const isBrotliSupported = require('./isSupported');
const { isError, convertHeaders } = require('../responseHelper');
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

    const originUrl = getOriginUrl(request);
    logger.log(`Fetching file for brotli from ${originUrl}`);

    const originResponse = await got(originUrl);
    const base64Body = (await brotliCompress(originResponse.body)).toString(
        'base64'
    );

    if (base64Body.length > 1003520) {
        logger.log(
            `Compressed response body size(${
                base64Body.length
            }B) exceeds limit, skipping.`
        );
        return response;
    }

    response = response || {};
    response = {
        ...response,
        status: originResponse.statusCode,
        statusDescription: originResponse.statusMessage,
        body: base64Body,
        headers: {
            ...convertHeaders(originResponse.headers),
            ...{
                'content-encoding': [{ key: 'Content-Encoding', value: 'br' }],
                'content-type': [
                    {
                        key: 'Content-Type',
                        value: originResponse.headers['content-type'],
                    },
                ],
                'x-orig-size': [
                    {
                        key: 'X-Orig-Size',
                        value: String(originResponse.body.length),
                    },
                ],
            },
        },
        bodyEncoding: 'base64',
    };
    logger.log(response);

    return response;
};
