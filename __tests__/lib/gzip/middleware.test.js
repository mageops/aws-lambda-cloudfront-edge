// @ts-check

describe('gzip middleware', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('does not change request when gzip is not supported', async () => {
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => false);
        });

        const request = Object.freeze({});
        const response = {};

        const middleware = require('../../../lib/gzip/middleware');

        await expect(middleware({ request, response })).resolves.toEqual({
            request,
            response,
        });
    });

    test('does not change response when gzip is not supported', async () => {
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => false);
        });

        const request = {};
        const response = Object.freeze({});

        const middleware = require('../../../lib/gzip/middleware');

        await expect(middleware({ request, response })).resolves.toEqual({
            request,
            response,
        });
    });

    test('adds Content-Encoding header when gzip is supported', async () => {
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/gzip/compress', () => {
            return jest.fn(input => global.Buffer.from(input));
        });

        const middleware = require('../../../lib/gzip/middleware');
        const { response } = await middleware({
            request: {},
            response: { body: '' },
        });

        expect(response.headers).toEqual({
            'content-encoding': [{ key: 'Content-Encoding', value: 'gzip' }],
        });
    });

    test('response body matches snapshot when supported', async () => {
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/gzip/compress', () => {
            return jest.fn(input => global.Buffer.from(input));
        });

        const middleware = require('../../../lib/gzip/middleware');
        const { response } = await middleware({
            request: {},
            response: { body: '' },
        });

        expect(response.body).toMatchSnapshot();
    });

    test('response headers match snapshot when supported', async () => {
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/gzip/compress', () => {
            return jest.fn(input => global.Buffer.from(input));
        });

        const middleware = require('../../../lib/gzip/middleware');
        const { response } = await middleware({
            request: {},
            response: { body: '' },
        });

        expect(response.headers).toMatchSnapshot();
    });

    test('rejects promise when compression errors', async () => {
        jest.mock('../../../lib/gzip/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/gzip/compress', () => {
            return jest.fn(() => {
                throw new Error('Expected error message');
            });
        });

        const middleware = require('../../../lib/gzip/middleware');

        await expect(middleware({ request: {}, response: {} })).rejects.toThrow('Expected error message');
    });
});
