// @ts-check

const imagemin = require('imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');

/**
 * Compresses given input using imagemin.
 *
 * @param {Buffer} input Buffer instance to compress.
 * @returns {Promise<Buffer>} Promise that resolves with Buffer of compressed input.
 */
module.exports = async input =>
    await imagemin.buffer(input, {
        plugins: [
            imageminGifsicle(),
            imageminOptipng(),
            imageminJpegtran({ progressive: true }),
            imageminSvgo(),
        ],
    });
