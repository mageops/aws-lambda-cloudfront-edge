// @ts-check

const logger = require('../logger');

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
    }

    return { request, response };
};
