const capitalize = require('lodash.capitalize');

const isError = response => {
    if (typeof response === 'object' && response !== null) {
        return response.statusCode > 299;
    }

    return false;
};

const allowedHeaders = [
    'date',
    'etag',
    'cache-control',
    'last-modified',
    'access-control-allow-headers',
    'access-control-allow-methods',
    'access-control-allow-origin',
    'access-control-expose-headers',
];

const headersToLambda = headers => {
    const convertedHeaders = {};
    for (let name in headers) {
        if (!allowedHeaders.includes(name)) {
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

const requestToHeaders = request =>
    Object.keys(request.headers || {}).reduce((headers, header) => {
        headers[header] = request.headers[header][0].value;

        return headers;
    }, {});

module.exports = {
    isError,
    headersToLambda,
    requestToHeaders,
};
