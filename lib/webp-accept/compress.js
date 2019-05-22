// @ts-check

const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

/**
 * Compresses given input using imagemin.
 *
 * @param {Buffer} input Buffer instance to compress.
 * @returns {Promise<Buffer>} Promise that resolves with Buffer of compressed input.
 */
module.exports = async input =>
    await imagemin.buffer(input, {
        plugins: [imageminWebp({ quality: 85 })],
    });
