// @ts-check

const { gzip } = require('zlib');

/**
 * Compresses given input using gzip algorithm.
 *
 * @param {Buffer|string} input Buffer instance or string to compress.
 * @returns {Promise<Buffer>} Promise that resolves with Buffer of compressed input.
 */
module.exports = input =>
    new Promise((resolve, reject) => {
        gzip(input, { level: 9 }, (error, buffer) => {
            if (error) {
                reject(Error(error));
                return;
            }
            resolve(buffer);
        });
    });
