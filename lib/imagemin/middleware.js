// @ts-check

const isContentTypeSupported = require('./isSupported');

/**
 * Fetches and optimizes requested image if supported.
 *
 * @param {object} request Request object.
 * @param {object} response Response object.
 */
module.exports = async (request, response = {}) => {
    if (!isContentTypeSupported(response)) {
        return;
    }

    const imagemin = require('imagemin');
    const imageminGifsicle = require('imagemin-gifsicle');
    // const imageminJpegtran = require('imagemin-jpegtran');
    const imageminOptipng = require('imagemin-optipng');
    const imageminSvgo = require('imagemin-svgo');
    // const imageminWebp = require('imagemin-webp');

    response.body = await imagemin.buffer(response.body, {
        plugins: [
            imageminGifsicle(),
            imageminOptipng(),
            // imageminJpegtran(),
            imageminSvgo(),
        ],
    });

    return response;
};
