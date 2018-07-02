// @ts-check

const path = require('path');

const supportedExtensions = ['.jpg.webp', '.jpeg.webp', '.png.webp'];

/**
 * Tells if image conversion to WebP can be applied for size savings.
 *
 * @param {object} request Request object.
 * @param {string} request.uri Requested resource URI.
 * @returns {boolean} True if optimization is supported, false otherwise.
 */
module.exports = ({ uri = '' }) => {
    const basename = path.basename(uri);

    return supportedExtensions.some(supportedExtension =>
        basename.endsWith(supportedExtension)
    );
};
