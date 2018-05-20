module.exports = async (request, response, next) => {
    const headers = request.headers;
    const supportsBrotli =
        headers['x-compression'] && headers['x-compression'][0].value === 'br';

    if (!supportsBrotli) {
        next();
        return;
    }

    const brotliCompress = require('./compress');

    if (
        headers['content-encoding'] &&
        headers['content-encoding'][0].value === 'gzip'
    ) {
        const gzipDecompress = require('../gzip/decompress');
        response.body = await gzipDecompress(response.body);
        headers['content-encoding'] = null;
    }

    if (!headers['content-encoding']) {
        response.body = await brotliCompress(response.body);
        response.headers['content-encoding'] = [
            { key: 'Content-Encoding', value: 'br' },
        ];
        response.bodyEncoding = 'base64';
    }

    next();
};
