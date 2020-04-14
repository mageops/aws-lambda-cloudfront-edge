describe('gzip isSupported', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns false when no accept-encoding header is present', () => {
        const isSupported = require('../../../lib/gzip/isSupported');
        const request = {
            headers: {},
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false when no headers are present', () => {
        const isSupported = require('../../../lib/gzip/isSupported');
        const request = {
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false when no URI is present', () => {
        const isSupported = require('../../../lib/gzip/isSupported');
        const request = {
            headers: {
                'accept-encoding': [{ value: 'gzip' }],
            },
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false for empty request', () => {
        const isSupported = require('../../../lib/gzip/isSupported');
        expect(isSupported({})).toBe(false);
    });

    test('returns false when accept-encoding does not contain gzip', () => {
        const isSupported = require('../../../lib/gzip/isSupported');
        const request = {
            headers: {
                'accept-encoding': [{ value: 'deflate' }],
            },
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns true when accept-encoding contains gzip and extension is supported', () => {
        const isSupported = require('../../../lib/gzip/isSupported');
        const request = {
            headers: {
                'accept-encoding': [{ value: 'gzip' }, { value: 'deflate' }],
            },
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns true when accept-encoding is string, contains gzip and extension is supported', () => {
        const isSupported = require('../../../lib/gzip/isSupported');
        const request = {
            headers: {
                'accept-encoding': [{ value: 'gzip deflate' }],
            },
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns false when accept-encoding contains gzip but file extension is not supported', () => {
        const isSupported = require('../../../lib/gzip/isSupported');
        const request = {
            headers: {
                'accept-encoding': [{ value: 'gzip' }],
            },
            uri: 'test.exe',
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false when both gzip and brotli are supported', () => {
        jest.mock('../../../lib/brotli/isSupported', () => {
            return jest.fn(() => true);
        });

        const isSupported = require('../../../lib/gzip/isSupported');
        const request = {
            headers: {
                'accept-encoding': [{ value: 'gzip' }],
            },
            uri: 'test.html',
        };
        expect(isSupported(request)).toBe(false);
    });
});
