const nock = require('nock');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

describe('imagemin middleware', () => {
    beforeEach(() => {
        jest.resetModules();
        nock.cleanAll();
    });

    test('returns null response when image extension is unsupported', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/imagemin/middleware');
        const response = await middleware({});

        expect(response).toEqual(null);
    });

    test('returns object response when file extension is supported', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/imagemin/compress', () => {
            return jest.fn(input => input);
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(
                () => 'http://example.com/imagemin-extension-supported'
            );
        });
        const input = await readFileAsync(
            path.resolve(__dirname, './image-jpg.jpg')
        );

        nock('http://example.com')
            .get('/imagemin-extension-supported')
            .reply(200, input, { 'content-type': 'image/jpg' });

        const middleware = require('../../../lib/imagemin/middleware');
        const response = await middleware({}, { headers: {} });

        expect(Object.keys(response).length).toBeGreaterThan(0);
    });

    test('returns null response when compressed file is too big', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/imagemin/compress', () => {
            return jest.fn(input => input);
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/imagemin-huge-img');
        });
        const input = await readFileAsync(
            path.resolve(__dirname, './image-jpg-huge.jpg')
        );

        nock('http://example.com')
            .get('/imagemin-huge-img')
            .reply(200, input, { 'content-type': 'image/jpg' });

        const middleware = require('../../../lib/imagemin/middleware');
        const response = await middleware({}, null);

        expect(response).toBe(null);
    });

    test('does not modify request object when file extension is unsupported', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/imagemin/middleware');
        const request = {};
        await middleware(request, {});

        expect(request).toEqual({});
    });

    test('does not modify response object when file extension is unsupported', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/imagemin/middleware');
        const response = {};

        await middleware({}, response);
        expect(response).toEqual({});
    });

    test('sets proper content-encoding header', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/imagemin/compress', () => {
            return jest.fn(input => input);
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/content-encoding');
        });
        const input = await readFileAsync(
            path.resolve(__dirname, './image-jpg.jpg')
        );
        nock('http://example.com')
            .get('/content-encoding')
            .reply(200, input, { 'content-type': 'image/jpg' });

        const middleware = require('../../../lib/imagemin/middleware');
        const response = await middleware({}, { headers: {} });

        expect(response.headers).toEqual({
            'content-type': [{ key: 'Content-Type', value: 'image/jpg' }],
            'x-orig-size': [
                {
                    key: 'X-Orig-Size',
                    value: '120452',
                },
            ],
        });
    });

    test('returns response for null argument', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/imagemin/compress', () => {
            return jest.fn(input => Buffer.from(input));
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/null-parameter');
        });
        nock('http://example.com')
            .get('/null-parameter')
            .reply(200, '', { 'content-type': 'text/html' });

        const middleware = require('../../../lib/imagemin/middleware');
        const response = await middleware({}, null);

        expect(response).not.toEqual(null);
    });

    test('response body matches snapshot when supported', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/imagemin/compress', () => {
            return jest.fn(input => input);
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/response-body-snapshot');
        });
        const input = await readFileAsync(
            path.resolve(__dirname, './image-png.png')
        );
        nock('http://example.com')
            .get('/response-body-snapshot')
            .reply(200, input, { 'content-type': 'image/png' });

        const middleware = require('../../../lib/imagemin/middleware');
        const response = await middleware({}, { headers: {} });

        expect(response.body).toMatchSnapshot();
    });

    test('passes request headers to origin server', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/imagemin/compress', () => {
            return jest.fn(input => input);
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/request-headers-pass');
        });
        const input = await readFileAsync(
            path.resolve(__dirname, './image-png.png')
        );
        nock('http://example.com')
            .get('/request-headers-pass')
            .reply(function(uri, requestBody, cb) {
                expect(this.req.headers['x-test-header']).toBe('test-value');

                cb(null, [200, input, { 'content-type': 'image/png' }]);
            });

        const middleware = require('../../../lib/imagemin/middleware');
        await middleware(
            {
                headers: {
                    'x-test-header': [
                        {
                            value: 'test-value',
                            key: 'X-Test-Header',
                        },
                    ],
                },
            },
            { headers: {} }
        );
    });

    test('response headers match snapshot when supported', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/imagemin/compress', () => {
            return jest.fn(input => input);
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(
                () => 'http://example.com/response-headers-snapshot'
            );
        });
        const input = await readFileAsync(
            path.resolve(__dirname, './image-png.png')
        );
        nock('http://example.com')
            .get('/response-headers-snapshot')
            .reply(200, input, { 'content-type': 'image/png' });

        const middleware = require('../../../lib/imagemin/middleware');
        const response = await middleware({}, { headers: {} });

        expect(response.headers).toMatchSnapshot();
    });

    test('rejects promise when server errors', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/server-error');
        });

        nock('http://example.com')
            .get('/server-error')
            .reply(503, '');

        const middleware = require('../../../lib/imagemin/middleware');

        expect(middleware({}, { headers: {} })).rejects.toThrow();
    });

    test('rejects promise when compression errors', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/imagemin/compress', () => {
            return jest.fn(() => {
                throw new Error();
            });
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/compression-error');
        });

        nock('http://example.com')
            .get('/compression-error')
            .reply(200, '', { 'content-type': 'image/png' });

        const middleware = require('../../../lib/imagemin/middleware');

        expect(middleware({}, { headers: {} })).rejects.toThrow();
    });

    test('forwards origin response headers when supported', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/imagemin/compress', () => {
            return jest.fn(input => input);
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(
                () => 'http://example.com/response-headers-supported'
            );
        });
        const input = await readFileAsync(
            path.resolve(__dirname, './image-png.png')
        );
        nock('http://example.com')
            .get('/response-headers-supported')
            .reply(200, input, {
                'content-type': 'text/html',
                'access-control-allow-origin': '*',
            });

        const middleware = require('../../../lib/imagemin/middleware');
        const response = await middleware({}, { headers: {} });

        expect(response.headers['access-control-allow-origin']).toBeTruthy();
    });
});
