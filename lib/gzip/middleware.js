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

        const buffer = await gzipCompress(response.body);
        const contentLength = buffer.byteLength;
        const base64Body = buffer.toString(
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
                    'content-length': [
                        { key: 'Content-Length', value: `${contentLength}` },
                    ],
                },
            },
            bodyEncoding: 'base64',
        };
    }

    return { request, response };
};
