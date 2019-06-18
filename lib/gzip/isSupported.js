// @ts-check

const path = require('path');

/**
 * Supported file extensions list.
 *
 * @see https://www.fastly.com/blog/new-gzip-settings-and-deciding-what-compress
 */
const supportedExtensions = [
    '.js',
    '.css',
    '.html',
    '.json',
    '.ico',
    '.eot',
    '.otf',
    '.ttf',
    '.svg',
];

/**
 * Tells if gzip compression is supported by given request object.
 *
 * @param {Object} request Request object.
 * @param {Object} request.headers Array containing request headers.
 * @param {string} request.uri Resource URI.
 * @returns {boolean} True if gzip is supported, false otherwise.
 */
module.exports = ({ headers = {}, uri = '' }) => {
    const acceptEncoding = headers['accept-encoding'];
    const extension = path.extname(uri);

    return Boolean(
        acceptEncoding &&
            acceptEncoding.some(header => header.value === 'gzip') &&
            supportedExtensions.includes(extension)
    );
};
