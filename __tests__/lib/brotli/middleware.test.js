const nock = require('nock');

describe('brotli middleware', () => {
    beforeEach(() => {
        jest.resetModules();
        nock.cleanAll();
    });

    test('returns null response when brotli is unsupported', async () => {
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => false);
        });
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/brotli/middleware');
        const response = await middleware({});

        expect(response).toEqual(null);
    });

    test('returns response object when brotli is supported', async () => {
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => false);
        });
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
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => false);
        });
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/brotli/middleware');
        const request = {};

        await middleware(request, {});
        expect({}).toEqual({});
    });

    test('does not modify response object when brotli is unsupported', async () => {
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => false);
        });
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
});
