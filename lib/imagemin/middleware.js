// @ts-check

const isSupported = require('./isSupported');
const isWebpSupported = require('../webp/isSupported');
const { isError, convertHeaders } = require('../responseHelper');
const logger = require('../logger');

/**
 * Fetches and optimizes requested image if supported.
 *
 * @param {object} request Request object.
 * @param {object} response Response object.
 */
module.exports = async (request, response = null) => {
    if (
        !isSupported(request) ||
        isWebpSupported(request) ||
        isError(response)
    ) {
        return response;
    }

    const got = require('got');
    const getOriginUrl = require('../getOriginUrl');
    const imageminCompress = require('./compress');

    const originUrl = getOriginUrl(request);
    logger.log(`Fetching image for imagemin from ${originUrl}`);

    const originResponse = await got(originUrl, { encoding: null });
    const base64Body = (await imageminCompress(originResponse.body)).toString(
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

    return response;
};
