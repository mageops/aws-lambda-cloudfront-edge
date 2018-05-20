const compress = require('iltorb').compress;

module.exports = body =>
    compress(body).then(buffer => buffer.toString('base64'));
