const nock = require('nock');

describe('brotli middleware', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('calls next middleware when brotli is unsupported', async () => {
        const next = jest.fn();
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => false);
        });
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/brotli/middleware');

        await middleware({}, {}, next);
        expect(next).toHaveBeenCalled();
    });

    test('calls next middleware when brotli is supported', async () => {
        const next = jest.fn();
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
            .reply(200, '');

        const middleware = require('../../../lib/brotli/middleware');

        await middleware({}, { headers: {} }, next);
        expect(next).toHaveBeenCalled();
    });

    test('does not modify request object when brotli is unsupported', async () => {
        const next = jest.fn();
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => false);
        });
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/brotli/middleware');
        const request = {};

        await middleware(request, {}, next);
        expect(request).toEqual({});
    });

    test('does not modify response object when brotli is unsupported', async () => {
        const next = jest.fn();
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => false);
        });
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/brotli/middleware');
        const response = {};

        await middleware({}, response, next);
        expect(response).toEqual({});
    });

    test('sets proper content-encoding header', async () => {
        const next = jest.fn();
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
            .reply(200, '');

        const middleware = require('../../../lib/brotli/middleware');
        const response = { headers: {} };

        await middleware({}, response, next);
        expect(response.headers).toEqual({
            'content-encoding': [{ key: 'Content-Encoding', value: 'br' }],
        });
    });

    test('response body matches snapshot when supported', async () => {
        const next = jest.fn();
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
            .reply(200, '');

        const middleware = require('../../../lib/brotli/middleware');
        const response = { headers: {} };

        await middleware({}, response, next);
        expect(response.body).toMatchSnapshot();
    });

    test('response body matches snapshot when unsupported', async () => {
        const next = jest.fn();
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/brotli/middleware');
        const response = { headers: {} };

        await middleware({}, response, next);
        expect(response.body).toMatchSnapshot();
    });

    test('response headers match snapshot when supported', async () => {
        const next = jest.fn();
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
            .reply(200, '');

        const middleware = require('../../../lib/brotli/middleware');
        const response = { headers: {} };

        await middleware({}, response, next);
        expect(response.headers).toMatchSnapshot();
    });

    test('response headers match snapshot when unsupported', async () => {
        const next = jest.fn();
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/brotli/middleware');
        const response = { headers: {} };

        await middleware({}, response, next);
        expect(response.headers).toMatchSnapshot();
    });
});
