// @ts-check

const isSupported = require('./isSupported');
const logger = require('../logger');

/**
 * Fetches requested resource and compresses it with gzip.
 * Compression is only applied if gzip is supported and brotli is not.
 *
 * @returns {Promise<object>} Response object.
 */
module.exports = async ({ request, response }) => {
    if (isSupported(request)) {
        const gzipCompress = require('./compress');

        const base64Body = (await gzipCompress(response.body)).toString(
            'base64'
        );

        response = {
            ...response,
            body: base64Body,
            headers: {
                ...response.headers,
                ...{
                    'content-encoding': [
                        { key: 'Content-Encoding', value: 'gzip' },
                    ],
                },
            },
            bodyEncoding: 'base64',
        };
    }

    return { request, response };
};
