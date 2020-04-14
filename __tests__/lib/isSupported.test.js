// @ts-check

const isSupported = require('../../lib/isSupported');

describe('webp isSupported', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns false when file extension is not supported', () => {
        const request = {
            uri: 'test.xls',
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false when URI is missing', () => {
        expect(isSupported({})).toBe(false);
    });

    test('returns true for supported file extension', () => {
        const request = {
            uri: 'test.png',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns true for supported Accept-Encoding', () => {
        const request = {
            headers: {
                'accept-encoding': [{ value: 'br' }],
            },
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns true for unsupported Accept-Encoding', () => {
        const request = {
            headers: {
                'accept-encoding': [{ value: 'none' }],
            },
        };
        expect(isSupported(request)).toBe(false);
    });
});
