const zlib = require('zlib');

module.exports = body =>
    new Promise((resolve, reject) => {
        zlib.gunzip(body, function(error, unzipped) {
            if (error) {
                reject(error);
                return;
            }

            resolve(unzipped.toString());
        });
    });
