const isGzipSupported = require('./isSupported');

module.exports = async (request, response, next) => {
    if (!isGzipSupported(request)) {
        next();
        return;
    }

    if (
        response.headers['content-encoding'] &&
        response.headers['content-encoding'][0].value === 'gzip'
    ) {
        const gzipDecompress = require('./decompress');
        response.body = gzipDecompress(response.body);
    }

    const gzipCompress = require('./compress');
    response.body = await gzipCompress(response.body);
    response.headers['content-encoding'] = [
        { key: 'Content-Encoding', value: 'gzip' },
    ];
    response.bodyEncoding = 'base64';

    next();
};
