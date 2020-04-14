// @ts-check

const isSupported = require('./isSupported');

/**
 * Fetches and optimizes requested image if supported.
 */
module.exports = async ({ request, response }) => {
    if (isSupported(request)) {
        const imageminCompress = require('./compress');

        const base64Body = (await imageminCompress(response.body)).toString(
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
                },
            },
        };
    }

    return { request, response };
};
