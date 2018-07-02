const isSupported = require('../../../lib/webp-accept/isSupported');

describe('webp isSupported', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns false when file extension is not supported', () => {
        const request = {
            uri: 'test.js',
            headers: {
                'x-webp': [{ value: '1' }],
            },
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false when URI is missing', () => {
        const request = {
            headers: {},
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false when headers is missing', () => {
        const request = {
            uri: 'test.jpg',
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false for empty request object', () => {
        expect(isSupported({})).toBe(false);
    });

    test('returns false when x-webp header is missing', () => {
        const request = {
            uri: 'test.jpg',
            headers: {},
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false when x-webp header has a wrong value', () => {
        const request = {
            uri: 'test.jpg',
            headers: {
                'x-webp': [{ value: '0' }],
            },
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns true for png files', () => {
        const request = {
            uri: 'test.png',
            headers: {
                'x-webp': [{ value: '1' }],
            },
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns true for jpg files', () => {
        const request = {
            uri: 'test.jpg',
            headers: {
                'x-webp': [{ value: '1' }],
            },
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns true for jpeg files', () => {
        const request = {
            uri: 'test.jpeg',
            headers: {
                'x-webp': [{ value: '1' }],
            },
        };
        expect(isSupported(request)).toBe(true);
    });

    test('returns false for gif files', () => {
        const request = {
            uri: 'test.gif',
            headers: {
                'x-webp': [{ value: '1' }],
            },
        };
        expect(isSupported(request)).toBe(false);
    });

    test('returns false for svg files', () => {
        const request = {
            uri: 'test.svg',
            headers: {
                'x-webp': [{ value: '1' }],
            },
        };
        expect(isSupported(request)).toBe(false);
    });
});
