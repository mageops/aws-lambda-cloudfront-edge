// @ts-check

const path = require('path');

const supportedExtensions = ['.jpg', '.jpeg', '.png'];

/**
 * Tells if image conversion to WebP can be applied for size savings.
 *
 * @param {object} request Request object.
 * @param {string} request.uri Requested resource URI.
 * @returns {boolean} True if optimization is supported, false otherwise.
 */
module.exports = ({ headers = {}, uri = '' }) => {
    const xWebp = headers['x-webp'];
    const extension = path.extname(uri);

    return Boolean(
        xWebp &&
            xWebp[0].value === '1' &&
            supportedExtensions.includes(extension)
    );
};
