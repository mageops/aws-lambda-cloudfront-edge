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
 * Tells if brotli compression is supported for given request.
 *
 * @param {object} request Request object.
 * @param {object} request.headers Request headers array.
 * @param {string} request.uri Request headers array.
 * @returns {boolean} True if brotli is supported, false otherwise.
 */
module.exports = ({ headers = {}, uri = '' }) => {
    const zlib = require('zlib');
    const nativeCompression = typeof zlib.brotliCompress !== 'undefined';
    const acceptEncoding = headers['accept-encoding'];
    const extension = path.extname(uri);

    return Boolean(
        nativeCompression &&
            acceptEncoding &&
            acceptEncoding.some((header) => header.value.includes('br')) &&
            supportedExtensions.includes(extension)
    );
};
