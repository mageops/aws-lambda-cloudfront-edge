const isSupported = require('../../../lib/webp-url/isSupported');

describe('webp isSupported', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns false when file extension is not supported', () => {
        const request = {
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false when URI is missing', () => {
        const request = {
            headers: {},
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false for empty request object', () => {
        expect(isSupported({})).toBe(false);
    });

    test('returns true for png files', () => {
        const request = {
            uri: 'test.png.webp',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns true for jpg files', () => {
        const request = {
            uri: 'test.jpg.webp',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns true for jpeg files', () => {
        const request = {
            uri: 'test.jpeg.webp',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns false for gif files', () => {
        const request = {
            uri: 'test.gif.webp',
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false for svg files', () => {
        const request = {
            uri: 'test.svg.webp',
        };
        expect(isSupported(request)).toBe(false);
    });
});
