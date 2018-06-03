const isSupported = require('../../../lib/brotli/isSupported');

describe('brotli isSupported', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns false when no x-compression header is present', () => {
        const response = {
            headers: {},
            uri: 'test.js',
        };
        expect(isSupported(response)).toBe(false);
    });

    test('returns false when x-compression does not contain br', () => {
        const response = {
            headers: {
                'x-compression': [{ value: 'deflate' }],
            },
            uri: 'test.js',
        };
        expect(isSupported(response)).toBe(false);
    });

    test('returns true when x-compression contains br and file extension is supported', () => {
        const response = {
            headers: {
                'x-compression': [
                    { value: 'br' },
                    { value: 'gzip' },
                    { value: 'deflate' },
                ],
            },
            uri: 'test.js',
        };
        expect(isSupported(response)).toBe(true);
    });

    test('returns true when x-compression contains br but file extension is unsupported', () => {
        const response = {
            headers: {
                'x-compression': [{ value: 'br' }],
            },
            uri: 'test.js',
        };
        expect(isSupported(response)).toBe(true);
    });
});
