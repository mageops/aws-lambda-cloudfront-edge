// @ts-check

const isSupported = require('./isSupported');
const { isError } = require('../responseHelper');
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

    response = response || {};
    const originUrl = getOriginUrl(request);
    logger.log(`Fetching image for webp from ${originUrl}`);

    const originResponse = await got(originUrl, { encoding: null });
    const compressedBuffer = await imageminCompress(originResponse.body);

    response = {
        ...response,
        status: originResponse.statusCode,
        statusDescription: originResponse.statusMessage,
        body: compressedBuffer.toString('base64'),
        headers: {
            ...originResponse.headers,
            ...{
                'content-type': [
                    {
                        key: 'Content-Type',
                        value: 'image/webp',
                    },
                ],
            },
        },
        bodyEncoding: 'base64',
    };

    return response;
};
