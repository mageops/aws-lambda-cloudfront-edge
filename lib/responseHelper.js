const capitalize = require('lodash.capitalize');

const isError = response => {
    if (typeof response === 'object' && response !== null) {
        return response.statusCode > 299;
    }

    return false;
};

const allowedResponseHeaders = [
    'date',
    'etag',
    'cache-control',
    'last-modified',
    'access-control-allow-headers',
    'access-control-allow-methods',
    'access-control-allow-origin',
    'access-control-expose-headers',
];

const allowedRequestHeaders = [
    'accept',
    'accept-language',
    'accept-encoding',
    'pragma',
    'user-agent',
    'cache-control',
    'access-control-allow-headers',
    'access-control-allow-methods',
    'access-control-allow-origin',
    'access-control-expose-headers',
];

const headersToLambda = headers => {
    const convertedHeaders = {};
    for (let name in headers) {
        if (!allowedResponseHeaders.includes(name)) {
            continue;
        }

        convertedHeaders[name] = [
            {
                key: name
                    .split('-')
                    .map(capitalize)
                    .join('-'),
                value: headers[name],
            },
        ];
    }

    return convertedHeaders;
};

const requestToHeaders = request => {
    const convertedHeaders = {};
    const headers = request.headers;
    for (let name in headers) {
        if (!allowedRequestHeaders.includes(name)) {
            continue;
        }

        convertedHeaders[name] = headers[name][0].value;
    }

    return convertedHeaders;
};

module.exports = {
    isError,
    headersToLambda,
    requestToHeaders,
};
