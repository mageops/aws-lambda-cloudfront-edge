// @ts-check

const isSupported = require('./isSupported');

/**
 * Fetches and optimizes requested image if supported.
 *
 * @param {object} request Request object.
 * @param {object} response Response object.
 */
module.exports = async (request, response = null) => {
    if (!isSupported(response)) {
        return response;
    }

    const got = require('got');
    const getOriginUrl = require('../getOriginUrl');
    const imageminCompress = require('./compress');

    response = response || {};
    const originUrl = getOriginUrl(request);
    console.log(`Fetching image for imagemin from ${originUrl}`);
    try {
        const originResponse = await got(originUrl, { encoding: null });
        const compressedBuffer = await imageminCompress(originResponse.body);

        response = {
            ...response,
            status: originResponse.statusCode,
            statusDescription: originResponse.statusMessage,
            body: compressedBuffer.toString('base64'),
            headers: {
                ...response.headers,
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
    } catch (errorResponse) {
        response = {
            status: errorResponse.statusCode,
            statusDescription: errorResponse.statusMessage,
        };
    }

    return response;
};
