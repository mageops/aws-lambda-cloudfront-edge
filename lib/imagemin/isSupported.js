const supportedContentTypes = [
    'image/png',
    'image/gif',
    'image/jpeg',
    'image/svg',
];

module.exports = response => {
    const headers = response.headers;
    const contentType = headers['content-type'];

    return contentType && supportedContentTypes.includes(contentType[0].value);
};
