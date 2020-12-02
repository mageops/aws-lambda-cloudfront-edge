// @ts-check

const isSupported = require('./isSupported');

/**
 * Fetches and optimizes requested image if supported.
 */
module.exports = async ({ request, response }) => {
    if (isSupported(request)) {
        const imageminCompress = require('./compress');

        const buffer = await imageminCompress(response.body)
        const contentLength = buffer.byteLength;
        const base64Body = buffer.toString(
            'base64'
        );

        response = {
            ...response,
            body: base64Body,
            bodyEncoding: 'base64',
            headers: {
                ...response.headers,
                ...{
                    'content-type': [
                        { key: 'Content-Type', value: 'image/webp' },
                    ],
                    'content-length': [
                        { key: 'Content-Length', value: `${contentLength}` },
                    ],
                },
            },
        };
    }

    return { request, response };
};
