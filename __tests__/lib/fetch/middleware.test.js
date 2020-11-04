const nock = require('nock');

describe('fetch middleware', () => {
    beforeEach(() => {
        jest.resetModules();
        nock.cleanAll();
    });

    test('rejects promise when server errors', async () => {
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/server-error');
        });

        nock('http://example.com')
            .persist()
            .replyContentLength()
            .get('/server-error')
            .reply(503, '');

        const middleware = require('../../../lib/fetch/middleware');

        await expect(middleware({}, { headers: {} })).rejects.toThrow('Response code 503');
    });

    test('rejects promise when resource is not found', async () => {
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/not-found');
        });

        nock('http://example.com')
            .persist()
            .replyContentLength()
            .get('/not-found')
            .reply(404, '');

        const middleware = require('../../../lib/fetch/middleware');

        await expect(middleware({}, { headers: {} })).rejects.toThrow('Response code 404');
    });

    test('fills response object with origin response headers', async () => {
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/origin-response-headers');
        });

        nock('http://example.com')
            .get('/origin-response-headers')
            .reply(200, '', { 'content-type': 'text/html', 'content-length': 0 });

        const middleware = require('../../../lib/fetch/middleware');
        const { response } = await middleware({
            request: {},
            response: { headers: {} },
        });

        expect(response.headers['content-type']).toBeTruthy();
    });

    test('adds x-orig-size header to response object', async () => {
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/origin-response-headers');
        });

        nock('http://example.com')
            .get('/origin-response-headers')
            .reply(200, '', { 'content-type': 'text/html', 'content-length': '0' });

        const middleware = require('../../../lib/fetch/middleware');
        const { response } = await middleware({
            request: {},
            response: { headers: {} },
        });

        expect(response.headers['x-orig-size']).toBeTruthy();
    });

    test('fills response object with origin response body', async () => {
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/origin-response-headers');
        });

        const body = 'foo bar';

        nock('http://example.com')
            .get('/origin-response-headers')
            .reply(200, body, { 'content-type': 'text/html', 'content-length': body.length.toString() });

        const middleware = require('../../../lib/fetch/middleware');
        const { response } = await middleware({
            request: {},
            response: { headers: {} },
        });

        expect(response.body).toEqual(body);
    });

    test('passes request headers to origin server', async () => {
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/request-headers-pass');
        });

        nock('http://example.com')
            .get('/request-headers-pass')
            .reply(function(uri, requestBody, cb) {
                expect(this.req.headers['accept-encoding']).toBe('text/html');

                cb(null, [200, '', {'content-length': '0'}]);
            });

        const middleware = require('../../../lib/fetch/middleware');
        await middleware({
            request: {
                headers: {
                    'accept-encoding': [
                        {
                            value: 'text/html',
                            key: 'Accept-Encoding',
                        },
                    ],
                },
            },
        });
    });

    test('passes host request header to origin server', async () => {
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/request-headers-host');
        });

        nock('http://example.com')
            .get('/request-headers-host')
            .reply(function(uri, requestBody, cb) {
                expect(this.req.headers['host']).toBe('example.com');

                cb(null, [200, '', {'content-length': '0'}]);
            });

        const middleware = require('../../../lib/fetch/middleware');
        await middleware({
            request: {
                headers: {
                    host: [
                        {
                            value: 'localhost',
                            key: 'Host',
                        },
                    ],
                },
            },
        });
    });
});
