// @ts-check

/**
 * Compresses given input using gzip algorithm.
 *
 * @param {Buffer|string} input Buffer instance or string to compress.
 * @returns {Promise<Buffer>} Promise that resolves with Buffer of compressed input.
 */
module.exports = async (input) =>
    new Promise((resolve, reject) => {
        const { gzip } = require('zlib');

        gzip(input, { level: 9 }, (error, buffer) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(buffer);
        });
    });
