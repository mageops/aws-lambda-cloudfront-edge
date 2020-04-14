// @ts-check

const { headersToLambda, requestToHeaders } = require('../responseHelper');

/**
 * Fetches requested resource and compresses it with gzip.
 * Compression is only applied if gzip is supported and brotli is not.
 *
 * @returns {Promise<object>} Response object.
 */
module.exports = async ({ request }) => {
    const got = require('got');
    const getOriginUrl = require('../getOriginUrl');

    const originUrl = getOriginUrl(request);
    const originResponse = await got(originUrl, {
        headers: requestToHeaders(request),
    });

    const response = {
        status: originResponse.statusCode,
        statusDescription: originResponse.statusMessage,
        body: originResponse.body,
        headers: {
            ...headersToLambda(originResponse.headers),
            ...{
                'x-orig-size': [
                    {
                        key: 'X-Orig-Size',
                        value: String(originResponse.body.length),
                    },
                ],
            },
        },
    };

    return { request, response };
};
