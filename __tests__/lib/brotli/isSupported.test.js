const isSupported = require('../../../lib/brotli/isSupported');

describe('brotli isSupported', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns false when no accept-encoding header is present', () => {
        const request = {
            headers: {},
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false when no headers are present', () => {
        const request = {
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false when URI is missing', () => {
        const request = {
            headers: {
                'accept-encoding': [{ value: 'deflate' }],
            },
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false when request is empty', () => {
        expect(isSupported({})).toBe(false);
    });

    test('returns false when accept-encoding does not contain br', () => {
        const request = {
            headers: {
                'accept-encoding': [{ value: 'deflate' }],
            },
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns true when accept-encoding contains br and file extension is supported', () => {
        const request = {
            headers: {
                'accept-encoding': [
                    { value: 'br' },
                    { value: 'gzip' },
                    { value: 'deflate' },
                ],
            },
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns true when accept-encoding is string, contains br and file extension is supported', () => {
        const request = {
            headers: {
                'accept-encoding': [{ value: 'gzip br deflate' }],
            },
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns false when accept-encoding contains br but file extension is unsupported', () => {
        const request = {
            headers: {
                'accept-encoding': [{ value: 'br' }],
            },
            uri: 'test.jpeg',
        };
        expect(isSupported(request)).toBe(false);
    });
});
