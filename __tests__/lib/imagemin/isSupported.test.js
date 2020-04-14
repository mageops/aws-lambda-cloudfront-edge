describe('imagemin isSupported', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns false when file extension is not supported', () => {
        const isSupported = require('../../../lib/imagemin/isSupported');
        const request = {
            uri: 'test.js',
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false for empty response', () => {
        const isSupported = require('../../../lib/imagemin/isSupported');
        expect(isSupported({})).toBe(false);
    });

    test('returns true for png files', () => {
        const isSupported = require('../../../lib/imagemin/isSupported');
        const request = {
            uri: 'test.png',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns true for jpg files', () => {
        const isSupported = require('../../../lib/imagemin/isSupported');
        const request = {
            uri: 'test.jpg',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns true for jpeg files', () => {
        const isSupported = require('../../../lib/imagemin/isSupported');
        const request = {
            uri: 'test.jpeg',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns true for gif files', () => {
        const isSupported = require('../../../lib/imagemin/isSupported');
        const request = {
            uri: 'test.gif',
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns false for svg files', () => {
        const isSupported = require('../../../lib/imagemin/isSupported');
        const request = {
            uri: 'test.svg',
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false when WebP is supported', () => {
        jest.mock('../../../lib/webp/isSupported', () => {
            return jest.fn(() => true);
        });

        const isSupported = require('../../../lib/imagemin/isSupported');
        const request = {
            uri: 'test.svg',
        };
        expect(isSupported(request)).toBe(false);
    });
});
