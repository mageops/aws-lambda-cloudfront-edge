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

const convertHeaders = headers => {
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

module.exports = {
    isError,
    convertHeaders,
};
