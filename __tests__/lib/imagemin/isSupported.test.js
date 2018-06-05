const isSupported = require('../../../lib/imagemin/isSupported');

describe('imagemin isSupported', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns false when file extension is not supported', () => {
        const response = {
            uri: 'test.js',
        };
        expect(isSupported(response)).toBe(false);
    });

    test('returns true for png files', () => {
        const response = {
            uri: 'test.png',
        };
        expect(isSupported(response)).toBe(true);
    });

    test('returns true for jpg files', () => {
        const response = {
            uri: 'test.jpg',
        };
        expect(isSupported(response)).toBe(true);
    });

    test('returns true for jpeg files', () => {
        const response = {
            uri: 'test.jpeg',
        };
        expect(isSupported(response)).toBe(true);
    });

    test('returns true for gif files', () => {
        const response = {
            uri: 'test.gif',
        };
        expect(isSupported(response)).toBe(true);
    });

    test('returns true for svg files', () => {
        const response = {
            uri: 'test.svg',
        };
        expect(isSupported(response)).toBe(true);
    });
});
