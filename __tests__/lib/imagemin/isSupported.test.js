const isSupported = require('../../../lib/imagemin/isSupported');

describe('imagemin isSupported', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns false when file extension is not supported', () => {
        const request = {
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false for empty response', () => {
        expect(isSupported({})).toBe(false);
    });

    test('returns true for png files', () => {
        const request = {
            uri: 'test.png',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns true for jpg files', () => {
        const request = {
            uri: 'test.jpg',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns true for jpeg files', () => {
        const request = {
            uri: 'test.jpeg',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns true for gif files', () => {
        const request = {
            uri: 'test.gif',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns true for svg files', () => {
        const request = {
            uri: 'test.svg',
        };
        expect(isSupported(request)).toBe(true);
    });
});
