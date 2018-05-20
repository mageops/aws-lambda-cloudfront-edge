const zlib = require('zlib');

module.exports = body =>
    new Promise((resolve, reject) => {
        zlib.gzip(body, { level: 9 }, (error, buffer) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(buffer.toString('base64'));
        });
    });
