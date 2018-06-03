const isSupported = require('../../../lib/gzip/isSupported');

describe('gzip isSupported', () => {
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

    test('returns false when accept-encoding does not contain gzip', () => {
        const request = {
            headers: {
                'accept-encoding': [{ value: 'deflate' }],
            },
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns true when accept-encoding contains gzip and extension is supported', () => {
        const request = {
            headers: {
                'accept-encoding': [{ value: 'gzip' }, { value: 'deflate' }],
            },
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns false when accept-encoding contains gzip but file extension is not supported', () => {
        const request = {
            headers: {
                'accept-encoding': [{ value: 'gzip' }],
            },
            uri: 'test.exe',
        };
        expect(isSupported(request)).toBe(false);
    });
});
