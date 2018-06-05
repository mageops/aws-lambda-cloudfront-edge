const isSupported = require('../../../lib/webp/isSupported');

describe('webp isSupported', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns false when file extension is not supported', () => {
        const response = {
            uri: 'test.js',
            headers: {
                'x-webp': [{ value: '1' }],
            },
        };
        expect(isSupported(response)).toBe(false);
    });

    test('returns false when x-webp header is missing', () => {
        const response = {
            uri: 'test.jpg',
            headers: {},
        };
        expect(isSupported(response)).toBe(false);
    });

    test('returns false when x-webp header has a wrong value', () => {
        const response = {
            uri: 'test.jpg',
            headers: {
                'x-webp': [{ value: '0' }],
            },
        };
        expect(isSupported(response)).toBe(false);
    });

    test('returns true for png files', () => {
        const response = {
            uri: 'test.png',
            headers: {
                'x-webp': [{ value: '1' }],
            },
        };
        expect(isSupported(response)).toBe(true);
    });

    test('returns true for jpg files', () => {
        const response = {
            uri: 'test.jpg',
            headers: {
                'x-webp': [{ value: '1' }],
            },
        };
        expect(isSupported(response)).toBe(true);
    });

    test('returns true for jpeg files', () => {
        const response = {
            uri: 'test.jpeg',
            headers: {
                'x-webp': [{ value: '1' }],
            },
        };
        expect(isSupported(response)).toBe(true);
    });

    test('returns false for gif files', () => {
        const response = {
            uri: 'test.gif',
            headers: {
                'x-webp': [{ value: '1' }],
            },
        };
        expect(isSupported(response)).toBe(false);
    });

    test('returns false for svg files', () => {
        const response = {
            uri: 'test.svg',
            headers: {
                'x-webp': [{ value: '1' }],
            },
        };
        expect(isSupported(response)).toBe(false);
    });
});
