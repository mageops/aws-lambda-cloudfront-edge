// @ts-check

const imagemin = require('imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

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
            imageminPngquant(),
            imageminMozjpeg({ quality: 90, progressive: true }),
        ],
    });
