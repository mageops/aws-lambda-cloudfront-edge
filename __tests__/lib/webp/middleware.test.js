const nock = require('nock');
const fs = require('fs');
const path = require('path');

describe('webp middleware', () => {
    beforeEach(() => {
        jest.resetModules();
        nock.cleanAll();
    });

    test('returns null response when image extension is unsupported', async () => {
        jest.mock('../../../lib/webp/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/webp/middleware');
        const response = await middleware({});

        expect(response).toEqual(null);
    });

    test('returns object response when file extension is supported', async () => {
        jest.mock('../../../lib/webp/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/webp/compress', () => {
            return jest.fn(input => input);
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/webp-extension-supported');
        });
        const input = fs.readFileSync(
            path.resolve(__dirname, './image-jpg.jpg')
        );

        nock('http://example.com')
            .get('/webp-extension-supported')
            .reply(200, input, { 'content-type': 'image/jpg' });

        const middleware = require('../../../lib/webp/middleware');
        const response = await middleware({}, { headers: {} });

        expect(Object.keys(response).length).toBeGreaterThan(0);
    });

    test('does not modify request object when file extension is unsupported', async () => {
        jest.mock('../../../lib/webp/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/webp/middleware');
        const request = {};
        await middleware(request, {});

        expect(request).toEqual({});
    });

    test('does not modify response object when file extension is unsupported', async () => {
        jest.mock('../../../lib/webp/isSupported', () => {
            return jest.fn(() => false);
        });

        const middleware = require('../../../lib/webp/middleware');
        const response = {};

        await middleware({}, response);
        expect(response).toEqual({});
    });

    test('sets proper content-encoding header', async () => {
        jest.mock('../../../lib/webp/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/webp/compress', () => {
            return jest.fn(input => input);
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/content-encoding');
        });
        const input = fs.readFileSync(
            path.resolve(__dirname, './image-jpg.jpg')
        );

        nock('http://example.com')
            .get('/content-encoding')
            .reply(200, input, { 'content-type': 'image/jpg' });

        const middleware = require('../../../lib/webp/middleware');
        const response = await middleware({}, { headers: {} });

        expect(response.headers).toEqual({
            'content-type': [{ key: 'Content-Type', value: 'image/webp' }],
        });
    });

    test('response body matches snapshot when supported', async () => {
        jest.mock('../../../lib/webp/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/webp/compress', () => {
            return jest.fn(input => input);
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(() => 'http://example.com/response-body-snapshot');
        });
        const input = fs.readFileSync(
            path.resolve(__dirname, './image-jpg.jpg')
        );

        nock('http://example.com')
            .get('/response-body-snapshot')
            .reply(200, input, { 'content-type': 'image/jpg' });

        const middleware = require('../../../lib/webp/middleware');
        const response = await middleware({}, { headers: {} });

        expect(response.body).toMatchSnapshot();
    });

    test('response headers match snapshot when supported', async () => {
        jest.mock('../../../lib/webp/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/webp/compress', () => {
            return jest.fn(input => input);
        });
        jest.mock('../../../lib/getOriginUrl', () => {
            return jest.fn(
                () => 'http://example.com/response-headers-snapshot'
            );
        });
        const input = fs.readFileSync(
            path.resolve(__dirname, './image-jpg.jpg')
        );

        nock('http://example.com')
            .get('/response-headers-snapshot')
            .reply(200, input, { 'content-type': 'image/jpg' });

        const middleware = require('../../../lib/webp/middleware');
        const response = await middleware({}, { headers: {} });

        expect(response.headers).toMatchSnapshot();
    });
});
