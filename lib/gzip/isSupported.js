module.exports = request => {
    const headers = request.headers;
    const acceptEncoding = headers['accept-encoding'];

    return (
        acceptEncoding && acceptEncoding.some(header => header.value === 'gzip')
    );
};
