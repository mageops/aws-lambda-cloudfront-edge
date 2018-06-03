const getOriginUrl = require('../../lib/getOriginUrl');

describe('getOriginUrl', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns URL with proper http protocol', () => {
        const request = {
            origin: {
                custom: {
                    protocol: 'http',
                    domainName: '',
                    path: '',
                },
            },
            uri: '',
        };
        expect(getOriginUrl(request)).toBe('http://');
    });

    test('returns URL with proper https protocol', () => {
        const request = {
            origin: {
                custom: {
                    protocol: 'https',
                    domainName: '',
                    path: '',
                },
            },
            uri: '',
        };
        expect(getOriginUrl(request)).toBe('https://');
    });

    test('returns URL with proper domain', () => {
        const request = {
            origin: {
                custom: {
                    protocol: 'https',
                    domainName: 'www.example.com',
                    path: '',
                },
            },
            uri: '',
        };
        expect(getOriginUrl(request)).toBe('https://www.example.com');
    });

    test('returns URL with proper path', () => {
        const request = {
            origin: {
                custom: {
                    protocol: 'https',
                    domainName: 'www.example.com',
                    path: '/example',
                },
            },
            uri: '',
        };
        expect(getOriginUrl(request)).toBe('https://www.example.com/example');
    });

    test('returns URL with proper URI', () => {
        const request = {
            origin: {
                custom: {
                    protocol: 'https',
                    domainName: 'www.example.com',
                    path: '/example',
                },
            },
            uri: '/example.jpeg',
        };
        expect(getOriginUrl(request)).toBe(
            'https://www.example.com/example/example.jpeg'
        );
    });
});
