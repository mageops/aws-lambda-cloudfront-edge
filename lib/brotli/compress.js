// @ts-check

const compress = require('iltorb').compress;

/**
 * Compresses given input using brotli algorithm.
 *
 * @param {Buffer|string} input Buffer instance or input string to compress.
 * @returns {Promise<Buffer>} Promise that resolves with Buffer of compressed input.
 */
module.exports = input => {
    if (typeof input === 'string') {
        input = Buffer.from(input);
    }

    return compress(input, { quality: 11 });
};
