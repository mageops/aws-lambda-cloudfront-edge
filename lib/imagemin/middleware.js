// @ts-check

const isContentTypeSupported = require('./isSupported');

/**
 * Fetches and optimizes requested image if supported.
 *
 * @param {object} request Request object.
 * @param {object} response Response object.
 * @param {function} next Callback to call next middleware.
 */
module.exports = async (request, response, next) => {
    if (!isContentTypeSupported(response)) {
        next();
        return;
    }

    const imagemin = require('imagemin');
    const imageminGifsicle = require('imagemin-gifsicle');
    // const imageminJpegtran = require('imagemin-jpegtran');
    const imageminOptipng = require('imagemin-optipng');
    // const imageminPngquant = require('imagemin-pngquant');
    const imageminSvgo = require('imagemin-svgo');
    // const imageminWebp = require('imagemin-webp');

    response.body = await imagemin.buffer(response.body, {
        plugins: [
            imageminGifsicle(),
            // imageminJpegtran(),
            // imageminPngquant(),
            imageminOptipng(),
            imageminSvgo(),
        ],
    });

    next();
};
