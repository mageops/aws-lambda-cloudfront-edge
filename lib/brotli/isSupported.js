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
];

/**
 * Tells if brotli compression is supported for given request.
 *
 * @param {object} request Request object.
 * @param {array} request.headers Request headers array.
 * @returns {boolean} True if brotli is supported, false otherwise.
 */
module.exports = ({ headers = {}, uri = '' }) => {
    const xCompression = headers['x-compression'];
    const extension = path.extname(uri);

    return Boolean(
        xCompression &&
            xCompression[0].value === 'br' &&
            supportedExtensions.includes(extension)
    );
};
