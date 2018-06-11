const isSupported = require('../../../lib/brotli/isSupported');

describe('brotli isSupported', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns false when no x-compression header is present', () => {
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
                'x-compression': [{ value: 'deflate' }],
            },
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false when request is empty', () => {
        expect(isSupported({})).toBe(false);
    });

    test('returns false when x-compression does not contain br', () => {
        const request = {
            headers: {
                'x-compression': [{ value: 'deflate' }],
            },
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns true when x-compression contains br and file extension is supported', () => {
        const request = {
            headers: {
                'x-compression': [
                    { value: 'br' },
                    { value: 'gzip' },
                    { value: 'deflate' },
                ],
            },
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns true when x-compression contains br but file extension is unsupported', () => {
        const request = {
            headers: {
                'x-compression': [{ value: 'br' }],
            },
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(true);
    });
});
