// @ts-check

/**
 * Returns complete URL to requested resource based on given request object.
 * @param {object} request Request object
 * @returns {string} URL to requested resource
 */
module.exports = ({ origin, uri }) => {
    origin = origin.custom;
    uri = uri.replace(/\.(jpeg|jpg|png)\.webp/i, '.$1');

    return `${origin.protocol}://${origin.domainName}${origin.path}${uri}`;
};
