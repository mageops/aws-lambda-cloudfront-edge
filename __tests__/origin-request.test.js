const originRequest = require('../origin-request');

const nock = require('nock');

describe('origin-request handler', () => {
    beforeEach(() => {
        jest.resetModules();
        nock.cleanAll();
    });

    test('is a function function', () => {
        expect(typeof originRequest.handler).toBe('function');
    });

    test('returns proper response when gzip is supported', async () => {
        const event = {
            Records: [
                {
                    cf: {
                        request: {
                            headers: {
                                'accept-encoding': [
                                    {
                                        value: 'gzip',
                                        key: 'Accept-Encoding',
                                    },
                                ],
                            },
                            origin: {
                                custom: {
                                    protocol: 'http',
                                    domainName: 'example.com',
                                    path: '',
                                },
                            },
                            uri: '/gzip-supported.js',
                        },
                    },
                },
            ],
        };
        nock('http://example.com')
            .get('/gzip-supported.js')
            .reply(200, '', { 'content-type': 'text/javascript' });

        const callback = jest.fn();

        await originRequest.handler(event, null, callback);

        expect(callback).toHaveBeenCalledWith(null, {
            body: 'H4sIAAAAAAACEwMAAAAAAAAAAAA=',
            bodyEncoding: 'base64',
            headers: {
                'content-encoding': [
                    { key: 'Content-Encoding', value: 'gzip' },
                ],
                'content-type': [
                    { key: 'Content-Type', value: 'text/javascript' },
                ],
            },
            status: 200,
            statusDescription: null,
        });
    });

    test('calls callback with request object when gzip is unsupported', async () => {
        const request = {
            headers: {},
            origin: {
                custom: {
                    protocol: 'http',
                    domainName: 'example.com',
                    path: '',
                },
            },
            uri: '/gzip-unsupported.js',
        };
        const event = {
            Records: [
                {
                    cf: {
                        request,
                    },
                },
            ],
        };

        const callback = jest.fn();

        await originRequest.handler(event, null, callback);

        expect(callback).toHaveBeenCalledWith(null, request);
    });

    test('returns proper response when only brotli is supported', async () => {
        const event = {
            Records: [
                {
                    cf: {
                        request: {
                            headers: {
                                'x-compression': [
                                    {
                                        value: 'br',
                                        key: 'X-Compression',
                                    },
                                ],
                            },
                            origin: {
                                custom: {
                                    protocol: 'http',
                                    domainName: 'example.com',
                                    path: '',
                                },
                            },
                            uri: '/brotli-supported.js',
                        },
                    },
                },
            ],
        };
        nock('http://example.com')
            .get('/brotli-supported.js')
            .reply(200, '', { 'content-type': 'text/javascript' });

        const callback = jest.fn();

        await originRequest.handler(event, null, callback);

        expect(callback).toHaveBeenCalledWith(null, {
            body: 'Ow==',
            bodyEncoding: 'base64',
            headers: {
                'content-encoding': [{ key: 'Content-Encoding', value: 'br' }],
                'content-type': [
                    { key: 'Content-Type', value: 'text/javascript' },
                ],
            },
            status: 200,
            statusDescription: null,
        });
    });

    test('returns proper response when both gzip and brotli are supported', async () => {
        const event = {
            Records: [
                {
                    cf: {
                        request: {
                            headers: {
                                'x-compression': [
                                    {
                                        value: 'br',
                                        key: 'X-Compression',
                                    },
                                ],
                                'accept-encoding': [
                                    {
                                        value: 'gzip',
                                        key: 'Accept-Encoding',
                                    },
                                ],
                            },
                            origin: {
                                custom: {
                                    protocol: 'http',
                                    domainName: 'example.com',
                                    path: '',
                                },
                            },
                            uri: '/brotli-gzip-supported.js',
                        },
                    },
                },
            ],
        };
        nock('http://example.com')
            .get('/brotli-gzip-supported.js')
            .reply(200, '', { 'content-type': 'text/javascript' });

        const callback = jest.fn();

        await originRequest.handler(event, null, callback);

        expect(callback).toHaveBeenCalledWith(null, {
            body: 'Ow==',
            bodyEncoding: 'base64',
            headers: {
                'content-encoding': [{ key: 'Content-Encoding', value: 'br' }],
                'content-type': [
                    { key: 'Content-Type', value: 'text/javascript' },
                ],
            },
            status: 200,
            statusDescription: null,
        });
    });

    test('calls callback with request when resource is not found', async () => {
        const request = {
            headers: {
                'accept-encoding': [
                    {
                        value: 'gzip',
                        key: 'Accept-Encoding',
                    },
                ],
            },
            origin: {
                custom: {
                    protocol: 'http',
                    domainName: 'example.com',
                    path: '',
                },
            },
            uri: '/not-found.js',
        };

        const event = {
            Records: [
                {
                    cf: {
                        request,
                    },
                },
            ],
        };
        nock('http://example.com')
            .get('/not-found.js')
            .reply(404, '', { 'content-type': 'text/javascript' });

        const callback = jest.fn();

        await originRequest.handler(event, null, callback);

        expect(callback).toHaveBeenCalledWith(null, request);
    });

    test('returns calls callback with request when server errors', async () => {
        const request = {
            headers: {
                'accept-encoding': [
                    {
                        value: 'gzip',
                        key: 'Accept-Encoding',
                    },
                ],
            },
            origin: {
                custom: {
                    protocol: 'http',
                    domainName: 'example.com',
                    path: '',
                },
            },
            uri: '/server-error.js',
        };

        const event = {
            Records: [
                {
                    cf: {
                        request,
                    },
                },
            ],
        };
        nock('http://example.com')
            .get('/server-error.js')
            .reply(503, '', { 'content-type': 'text/javascript' });

        const callback = jest.fn();

        await originRequest.handler(event, null, callback);

        expect(callback).toHaveBeenCalledWith(null, request);
    });

    test('calls callback with request when file extension is not supported', async () => {
        const request = {
            headers: {
                'accept-encoding': [
                    {
                        value: 'gzip',
                        key: 'Accept-Encoding',
                    },
                ],
            },
            origin: {
                custom: {
                    protocol: 'http',
                    domainName: 'example.com',
                    path: '',
                },
            },
            uri: '/not-supported.exe',
        };
        const event = {
            Records: [
                {
                    cf: {
                        request,
                    },
                },
            ],
        };
        const callback = jest.fn();

        await originRequest.handler(event, null, callback);

        expect(callback).toHaveBeenCalledWith(null, request);
    });
});
