const nock = require('nock');

describe('brotli middleware', () => {
    beforeEach(() => {
        jest.resetModules();
        nock.cleanAll();
    });

    test('returns null response when brotli is unsupported', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/brotli/middleware');
        const response = await middleware({});

        expect(response).toEqual(null);
    });

    test('returns response object when brotli is supported', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/brotli/compress', () => {
            return jest.fn(input => Buffer.from(input));
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/brotli-supported');
        });
        nock('http://example.com')
            .get('/brotli-supported')
            .reply(200, '', { 'content-type': 'text/html' });

        const middleware = require('../../../lib/brotli/middleware');

        const response = await middleware({}, { headers: {} });
        expect(Object.keys(response).length).toBeGreaterThan(0);
    });

    test('does not modify request object when brotli is unsupported', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/brotli/middleware');
        const request = {};

        await middleware(request, {});
        expect({}).toEqual({});
    });

    test('does not modify response object when brotli is unsupported', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/brotli/middleware');
        const response = {};

        await middleware(response, {});
        expect(response).toEqual({});
    });

    test('sets proper content-encoding header', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/brotli/compress', () => {
            return jest.fn(input => Buffer.from(input));
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/content-encoding');
        });
        nock('http://example.com')
            .get('/content-encoding')
            .reply(200, '', { 'content-type': 'text/html' });

        const middleware = require('../../../lib/brotli/middleware');
        const response = await middleware({}, { headers: {} });

        expect(response.headers).toEqual({
            'content-encoding': [{ key: 'Content-Encoding', value: 'br' }],
            'content-type': [{ key: 'Content-Type', value: 'text/html' }],
        });
    });

    test('returns response for null argument', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/brotli/compress', () => {
            return jest.fn(input => Buffer.from(input));
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/null-parameter');
        });
        nock('http://example.com')
            .get('/null-parameter')
            .reply(200, '', { 'content-type': 'text/html' });

        const middleware = require('../../../lib/brotli/middleware');
        const response = await middleware({}, null);

        expect(response).not.toEqual(null);
    });

    test('response body matches snapshot when supported', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/brotli/compress', () => {
            return jest.fn(input => Buffer.from(input));
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/response-body-snapshot');
        });
        nock('http://example.com')
            .get('/response-body-snapshot')
            .reply(200, '', { 'content-type': 'text/html' });

        const middleware = require('../../../lib/brotli/middleware');
        const response = await middleware({}, { headers: {} });

        expect(response.body).toMatchSnapshot();
    });

    test('response headers match snapshot when supported', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/brotli/compress', () => {
            return jest.fn(input => Buffer.from(input));
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(
                () => 'http://example.com/response-headers-snapshot'
            );
        });
        nock('http://example.com')
            .get('/response-headers-snapshot')
            .reply(200, '', { 'content-type': 'text/html' });

        const middleware = require('../../../lib/brotli/middleware');

        const response = await middleware({}, { headers: {} });

        expect(response.headers).toMatchSnapshot();
    });

    test('rejects promise when server errors', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/server-error');
        });

        nock('http://example.com')
            .get('/server-error')
            .reply(503, '');

        const middleware = require('../../../lib/brotli/middleware');

        expect(middleware({}, { headers: {} })).rejects.toThrow();
    });

    test('rejects promise when compression errors', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/brotli/compress', () => {
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

        const middleware = require('../../../lib/brotli/middleware');

        expect(middleware({}, { headers: {} })).rejects.toThrow();
    });

    test('forwards origin response headers when supported', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/brotli/compress', () => {
            return jest.fn(input => Buffer.from(input));
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/response-headers-forward');
        });
        nock('http://example.com')
            .get('/response-headers-forward')
            .reply(200, '', {
                'content-type': 'text/html',
                'access-control-allow-origin': '*',
            });

        const middleware = require('../../../lib/brotli/middleware');

        const response = await middleware({}, { headers: {} });

        expect(response.headers['access-control-allow-origin']).toBeTruthy();
    });
});
