// @ts-check

const path = require('path');

const isBrotliSupported = require('../brotli/isSupported');

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
 * @param {object} request Request object.
 * @param {object=} request.headers Request headers array.
 * @param {string=} request.uri Request headers array.
 * @returns {boolean} True if gzip is supported, false otherwise.
 */
module.exports = ({ headers = {}, uri = '' }) => {
    if (isBrotliSupported({ headers, uri })) {
        return false;
    }

    const acceptEncoding = headers['accept-encoding'];
    const extension = path.extname(uri);

    return Boolean(
        acceptEncoding &&
            acceptEncoding.some((header) => header.value.includes('gzip')) &&
            supportedExtensions.includes(extension)
    );
};
