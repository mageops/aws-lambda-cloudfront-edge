// @ts-check

const isBrotliSupported = require('./isSupported');

/**
 * Fetches and compresses requested resource with brotli algorithm.
 * Compression is only applied if supported by the client.
 * @returns {Promise<object>} Response object.
 */
module.exports = async ({ request, response }) => {
    if (isBrotliSupported(request)) {
        const brotliCompress = require('./compress');

        const base64Body = (await brotliCompress(response.body)).toString(
            'base64'
        );

        response = {
            ...response,
            body: base64Body,
            headers: {
                ...response.headers,
                ...{
                    'content-encoding': [
                        { key: 'Content-Encoding', value: 'br' },
                    ],
                },
            },
            bodyEncoding: 'base64',
        };
    }

    return { request, response };
};
