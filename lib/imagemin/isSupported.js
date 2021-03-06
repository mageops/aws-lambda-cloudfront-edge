// @ts-check

const path = require('path');

const isWebpSupported = require('../webp/isSupported');

const supportedExtensions = ['.png', '.gif', '.jpeg', '.jpg'];

/**
 * Tells if image compression can be applied for given request object.
 *
 * @param {object} request Request object.
 * @param {string} request.uri Requested resource URI.
 * @returns {boolean} True if optimization is supported, false otherwise.
 */
module.exports = ({ uri = '' }) => {
    if (isWebpSupported({ uri })) {
        return false;
    }

    const extension = path.extname(uri);

    return supportedExtensions.includes(extension);
};
