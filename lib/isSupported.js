// @ts-check

const path = require('path');

const supportedExtensions = [
    // Brotli, gzip, CSS & JS optimizers.
    '.js',
    '.css',
    '.html',
    '.json',
    '.ico',
    '.eot',
    '.otf',
    '.ttf',
    '.svg',
    // Imagemin compression
    '.png',
    '.gif',
    '.jpeg',
    '.jpg',
    // WebP on-the-fly conversion
    '.jpg.webp',
    '.jpeg.webp',
    '.png.webp',
];

const supportedEncodings = ['gzip', 'br'];

/**
 * Tells if lambda compression may be supported for a given request
 *
 * @param {object} request Request object.
 * @param {object=} request.headers Request headers array.
 * @param {string=} request.uri Request headers array.
 * @returns {boolean} True if request is supported, false otherwise.
 */
module.exports = ({ headers = {}, uri = '' }) => {
    const acceptEncoding = headers['accept-encoding'];
    const basename = path.basename(uri);

    /**
     * We support requested accept encoding for optimization.
     */
    const supportsEncoding =
        acceptEncoding &&
        acceptEncoding.some(header =>
            supportedEncodings.includes(header.value)
        );

    /**
     * We support requested file type for optimization.
     */
    const supportsExtension = supportedExtensions.some(supportedExtension =>
        basename.endsWith(supportedExtension)
    );

    return Boolean(supportsExtension || supportsEncoding);
};
