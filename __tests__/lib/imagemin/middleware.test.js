const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

describe('imagemin middleware', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('does not modify request object when image extension is unsupported', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => false);
        });

        const request = Object.freeze({});
        const response = {};

        const middleware = require('../../../lib/imagemin/middleware');

        expect(middleware({ request, response })).resolves.toEqual({
            request,
            response,
        });
    });

    test('does not modify response object when image extension is unsupported', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => false);
        });

        const request = {};
        const response = Object.freeze({});

        const middleware = require('../../../lib/imagemin/middleware');

        await expect(middleware({ request, response })).resolves.toEqual({
            request,
            response,
        });
    });

    test('sets response body when file extension is supported', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/imagemin/compress', () => {
            return jest.fn(input => input);
        });

        const body = await readFileAsync(
            path.resolve(__dirname, './image-jpg.jpg')
        );

        const middleware = require('../../../lib/imagemin/middleware');
        const { response } = await middleware({
            request: {},
            response: { body },
        });

        expect(response.body.length).toBeTruthy();
    });

    test('sets response body encoding when file extension is supported', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/imagemin/compress', () => {
            return jest.fn(input => input);
        });

        const body = await readFileAsync(
            path.resolve(__dirname, './image-jpg.jpg')
        );

        const middleware = require('../../../lib/imagemin/middleware');
        const { response } = await middleware({
            request: {},
            response: { body },
        });

        expect(response.bodyEncoding).toBe('base64');
    });

    test('response body matches snapshot when supported', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/imagemin/compress', () => {
            return jest.fn(input => input);
        });

        const body = await readFileAsync(
            path.resolve(__dirname, './image-png.png')
        );

        const middleware = require('../../../lib/imagemin/middleware');
        const { response } = await middleware({
            request: {},
            response: { body },
        });

        expect(response.body).toMatchSnapshot();
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
        const body = await readFileAsync(
            path.resolve(__dirname, './image-png.png')
        );

        const middleware = require('../../../lib/imagemin/middleware');
        const { response } = await middleware({
            request: {},
            response: {
                headers: {
                    'content-type': [
                        {
                            key: 'Content-Type',
                            value: 'image/png',
                        },
                    ],
                },
                body,
            },
        });

        expect(response.headers).toMatchSnapshot();
    });

    test('rejects promise when compression errors', async () => {
        jest.mock('../../../lib/imagemin/isSupported', () => {
            return jest.fn(() => true);
        });
        jest.mock('../../../lib/imagemin/compress', () => {
            return jest.fn(() => {
                throw new Error('Expected error message');
            });
        });

        const middleware = require('../../../lib/imagemin/middleware');

        await expect(
            middleware({ request: {}, response: { body: '' } })
        ).rejects.toThrow('Expected error message');
    });
});
