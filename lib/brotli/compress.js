// @ts-check

/**
 * Compresses given input using gzip algorithm.
 *
 * @param {Buffer|string} input Buffer instance or string to compress.
 * @returns {Promise<Buffer>} Promise that resolves with Buffer of compressed input.
 */
module.exports = (input) =>
    new Promise((resolve, reject) => {
        const zlib = require('zlib');

        zlib.brotliCompress(
            input,
            {
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                },
            },
            (error, buffer) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(buffer);
            }
        );
    });
