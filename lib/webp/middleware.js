// @ts-check

const isSupported = require('./isSupported');
const { isError, convertHeaders } = require('../responseHelper');
const logger = require('../logger');

/**
 * Fetches and optimizes requested image if supported.
 *
 * @param {object} request Request object.
 * @param {object} response Response object.
 */
module.exports = async (request, response = null) => {
    if (!isSupported(request) || isError(response)) {
        return response;
    }

    const got = require('got');
    const getOriginUrl = require('../getOriginUrl');
    const imageminCompress = require('./compress');

    const originUrl = getOriginUrl(request);
    logger.log(`Fetching image for webp from ${originUrl}`);

    const originResponse = await got(originUrl, { encoding: null });
    const compressedBuffer = await imageminCompress(originResponse.body);

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
                'content-type': [
                    {
                        key: 'Content-Type',
                        value: 'image/webp',
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
