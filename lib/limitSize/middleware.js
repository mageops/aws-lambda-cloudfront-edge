// @ts-check

const logger = require('../logger');
const { readHeader } = require('../responseHelper');

/**
 * Prevents lambda from throwing 5xx errors because the response it generated exceeds the limit.
 */
module.exports = async ({ request, response }) => {
    if (response) {
        const responseBody = response.body;

        if (responseBody && responseBody.length > 1003520) {
            logger.log(
                `Compressed response body size(${responseBody.length}B) exceeds lambda limit, skipping.`
            );
            response = request;
        }

        const newContentLength = readHeader(response, 'content-length');
        const originalContentLength = readHeader(response, 'x-orig-size');
        if (originalContentLength && newContentLength && newContentLength >= originalContentLength) {
            logger.log(
                `Compressed response body size (${newContentLength}B) is not smaller than original size (${originalContentLength}B), skipping.`
            );
            response = request;
        }
    }

    return { request, response };
};
