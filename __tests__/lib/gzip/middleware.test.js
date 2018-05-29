const nock = require('nock');

describe('gzip middleware', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('calls next middleware when gzip is unsupported', async () => {
        const next = jest.fn();
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => false);
        });
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/gzip/middleware');

        await middleware({}, {}, next);
        expect(next).toHaveBeenCalled();
    });

    test('calls next middleware when gzip is supported', async () => {
        const next = jest.fn();
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/gzip/compress', () => {
            return jest.fn(input => Buffer.from(input));
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/next-gzip-supported');
        });
        nock('http://example.com')
            .get('/next-gzip-supported')
            .reply(200, '');

        const middleware = require('../../../lib/gzip/middleware');

        await middleware({}, { headers: {} }, next);
        expect(next).toHaveBeenCalled();
    });

    test('does not modify request object when gzip is unsupported', async () => {
        const next = jest.fn();
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => false);
        });
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/gzip/middleware');
        const request = {};

        await middleware(request, {}, next);
        expect(request).toEqual({});
    });

    test('does not modify request object when both gzip and brotli are supported', async () => {
        const next = jest.fn();
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => true);
        });

        const middleware = require('../../../lib/gzip/middleware');
        const request = {};

        await middleware(request, {}, next);
        expect(request).toEqual({});
    });

    test('does not modify response object when both gzip and brotli supported', async () => {
        const next = jest.fn();
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => true);
        });

        const middleware = require('../../../lib/gzip/middleware');
        const response = {};

        await middleware({}, response, next);
        expect(response).toEqual({});
    });

    test('does not modify response object when gzip is unsupported', async () => {
        const next = jest.fn();
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => false);
        });
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/gzip/middleware');
        const response = {};

        await middleware({}, response, next);
        expect(response).toEqual({});
    });

    test('sets proper content-encoding header', async () => {
        const next = jest.fn();
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/gzip/compress', () => {
            return jest.fn(input => Buffer.from(input));
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/content-encoding');
        });
        nock('http://example.com')
            .get('/content-encoding')
            .reply(200, '');

        const middleware = require('../../../lib/gzip/middleware');
        const response = { headers: {} };

        await middleware({}, response, next);
        expect(response.headers).toEqual({
            'content-encoding': [{ key: 'Content-Encoding', value: 'gzip' }],
        });
    });

    test('response body matches snapshot when supported', async () => {
        const next = jest.fn();
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/gzip/compress', () => {
            return jest.fn(input => Buffer.from(input));
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/response-body-snapshot');
        });
        nock('http://example.com')
            .get('/response-body-snapshot')
            .reply(200, '');

        const middleware = require('../../../lib/gzip/middleware');
        const response = { headers: {} };

        await middleware({}, response, next);
        expect(response.body).toMatchSnapshot();
    });

    test('response body matches snapshot when unsupported', async () => {
        const next = jest.fn();
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => false);
        });
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/gzip/middleware');
        const response = { headers: {} };

        await middleware({}, response, next);
        expect(response.body).toMatchSnapshot();
    });

    test('response headers match snapshot when supported', async () => {
        const next = jest.fn();
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/gzip/compress', () => {
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

        const middleware = require('../../../lib/gzip/middleware');
        const response = { headers: {} };

        await middleware({}, response, next);
        expect(response.headers).toMatchSnapshot();
    });

    test('response headers match snapshot when unsupported', async () => {
        const next = jest.fn();
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => false);
        });
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/gzip/middleware');
        const response = { headers: {} };

        await middleware({}, response, next);
        expect(response.headers).toMatchSnapshot();
    });
});
