// @ts-check

const nock = require('nock');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

describe('webp middleware', () => {
    beforeEach(() => {
        jest.resetModules();
        nock.cleanAll();
    });

    test('does not change request when WebP is not supported', async () => {
        jest.mock('../../../lib/webp/isSupported', () => {
            return jest.fn(() => false);
        });

        const request = Object.freeze({});
        const response = {};

        const middleware = require('../../../lib/brotli/middleware');

        await expect(middleware({ request, response })).resolves.toEqual({
            request,
            response,
        });
    });

    test('does not change response when WebP is not supported', async () => {
        jest.mock('../../../lib/webp/isSupported', () => {
            return jest.fn(() => false);
        });

        const request = {};
        const response = Object.freeze({});

        const middleware = require('../../../lib/brotli/middleware');

        await expect(middleware({ request, response })).resolves.toEqual({
            request,
            response,
        });
    });

    test('returns object response when file extension is supported', async () => {
        jest.mock('../../../lib/webp/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/webp/compress', () => {
            return jest.fn(input => input);
        });

        const body = await readFileAsync(
            path.resolve(__dirname, './image-jpg.jpg')
        );

        const middleware = require('../../../lib/webp/middleware');
        const { response } = await middleware({
            request: {},
            response: { body },
        });

        expect(response.body.length).toBeGreaterThan(0);
    });

    test('sets proper Content-Type header', async () => {
        jest.mock('../../../lib/webp/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/webp/compress', () => {
            return jest.fn(input => input);
        });

        const body = await readFileAsync(
            path.resolve(__dirname, './image-jpg.jpg')
        );

        const middleware = require('../../../lib/webp/middleware');
        const { response } = await middleware({
            request: {},
            response: { body },
        });

        expect(response.headers).toEqual({
            'content-length': [{ key: 'Content-Length', value: '154016' }],
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

        const body = await readFileAsync(
            path.resolve(__dirname, './image-jpg.jpg')
        );

        const middleware = require('../../../lib/webp/middleware');
        const { response } = await middleware({
            request: {},
            response: { body },
        });

        expect(response.body).toMatchSnapshot();
    });

    test('response headers match snapshot when supported', async () => {
        jest.mock('../../../lib/webp/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/webp/compress', () => {
            return jest.fn(input => input);
        });

        const body = await readFileAsync(
            path.resolve(__dirname, './image-jpg.jpg')
        );

        const middleware = require('../../../lib/webp/middleware');
        const { response } = await middleware({
            request: {},
            response: { body },
        });

        expect(response.headers).toMatchSnapshot();
    });

    test('rejects promise when compression errors', async () => {
        jest.mock('../../../lib/webp/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/webp/compress', () => {
            return jest.fn(() => {
                throw new Error('Expected error message');
            });
        });

        const middleware = require('../../../lib/webp/middleware');

        await expect(
            middleware({ request: {}, response: { body: '' } })
        ).rejects.toThrow('Expected error message');
    });
});
