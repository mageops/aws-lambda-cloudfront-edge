describe('brotli middleware', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('does not change request when brotli is not supported', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const request = Object.freeze({});
        const response = { body: '' };

        const middleware = require('../../../lib/brotli/middleware');

        await expect(middleware({ request, response })).resolves.toEqual({
            request,
            response,
        });
    });

    test('does not change response when brotli is not supported', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => false);
        });

        const request = {};
        const response = Object.freeze({ body: '' });

        const middleware = require('../../../lib/brotli/middleware');

        await expect(middleware({ request, response })).resolves.toEqual({
            request,
            response,
        });
    });

    test('sets proper Content-Encoding header when supported', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/brotli/compress', () => {
            return jest.fn(input => global.Buffer.from(input));
        });

        const middleware = require('../../../lib/brotli/middleware');
        const { response } = await middleware({
            request: {},
            response: { body: '' },
        });

        expect(response.headers).toEqual({
            'content-encoding': [{ key: 'Content-Encoding', value: 'br' }],
        });
    });

    test('response body matches snapshot when supported', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/brotli/compress', () => {
            return jest.fn(input => global.Buffer.from(input));
        });

        const middleware = require('../../../lib/brotli/middleware');
        const { response } = await middleware({
            request: {},
            response: { body: '' },
        });

        expect(response.body).toMatchSnapshot();
    });

    test('response headers match snapshot when supported', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/brotli/compress', () => {
            return jest.fn(input => global.Buffer.from(input));
        });

        const middleware = require('../../../lib/brotli/middleware');

        const { response } = await middleware({
            request: {},
            response: { body: '' },
        });

        expect(response.headers).toMatchSnapshot();
    });

    test('rejects promise when compression errors', async () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/brotli/compress', () => {
            return jest.fn(() => {
                throw new Error('Expected error message');
            });
        });

        const middleware = require('../../../lib/brotli/middleware');

        await expect(
            middleware({ request: {}, response: { body: '' } })
        ).rejects.toThrow('Expected error message');
    });
});
