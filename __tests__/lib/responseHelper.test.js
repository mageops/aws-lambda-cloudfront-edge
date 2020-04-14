const {
    isError,
    headersToLambda,
    requestToHeaders,
} = require('../../lib/responseHelper');

describe('response', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    describe('isError helper', () => {
        test('returns false for null response', () => {
            expect(isError(null)).toBe(false);
        });

        test('returns false for response with 2xx status code', () => {
            const response = {
                statusCode: 200,
            };

            expect(isError(response)).toBe(false);
        });

        test('returns true for response with 3xx status code', () => {
            const response = {
                statusCode: 300,
            };

            expect(isError(response)).toBe(true);
        });

        test('returns true for response with 4xx status code', () => {
            const response = {
                statusCode: 400,
            };

            expect(isError(response)).toBe(true);
        });

        test('returns true for response with 5xx status code', () => {
            const response = {
                statusCode: 500,
            };

            expect(isError(response)).toBe(true);
        });
    });

    describe('headersToLambda helper', () => {
        test('converts header to lambda convention', () => {
            expect(
                headersToLambda({ 'access-control-allow-origin': '*' })
            ).toEqual({
                'access-control-allow-origin': [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                ],
            });
        });

        test('allows CORS headers', () => {
            expect(
                headersToLambda({
                    'access-control-allow-headers':
                        'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range,Host,Origin,Accept',
                    'access-control-allow-methods': 'GET, POST, OPTIONS',
                    'access-control-allow-origin': '*',
                    'access-control-expose-headers':
                        'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range,Host,Origin,Accept',
                })
            ).toEqual({
                'access-control-allow-headers': [
                    {
                        key: 'Access-Control-Allow-Headers',
                        value:
                            'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range,Host,Origin,Accept',
                    },
                ],
                'access-control-allow-methods': [
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, POST, OPTIONS',
                    },
                ],
                'access-control-allow-origin': [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                ],
                'access-control-expose-headers': [
                    {
                        key: 'Access-Control-Expose-Headers',
                        value:
                            'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range,Host,Origin,Accept',
                    },
                ],
            });
        });

        test('allows content-type headers', () => {
            expect(headersToLambda({ 'content-type': 'text/html' })).toEqual({
                'content-type': [
                    {
                        key: 'Content-Type',
                        value: 'text/html',
                    },
                ],
            });
        });

        test('allows caching headers', () => {
            expect(
                headersToLambda({ 'cache-control': 'max-age=31536000' })
            ).toEqual({
                'cache-control': [
                    {
                        key: 'Cache-Control',
                        value: 'max-age=31536000',
                    },
                ],
            });
        });

        test('allows etag header', () => {
            expect(headersToLambda({ etag: 'W/"5b18fcd0-d37ea"' })).toEqual({
                etag: [
                    {
                        key: 'Etag',
                        value: 'W/"5b18fcd0-d37ea"',
                    },
                ],
            });
        });

        test('allows last-modified header', () => {
            expect(
                headersToLambda({
                    'last-modified': 'Thu, 07 Jun 2018 09:37:20 GMT',
                })
            ).toEqual({
                'last-modified': [
                    {
                        key: 'Last-Modified',
                        value: 'Thu, 07 Jun 2018 09:37:20 GMT',
                    },
                ],
            });
        });
    });

    describe('requestToHeaders helper', () => {
        test('converts lambda convention to header', () => {
            expect(
                requestToHeaders({
                    headers: {
                        'access-control-allow-origin': [
                            {
                                key: 'Access-Control-Allow-Origin',
                                value: '*',
                            },
                        ],
                    },
                })
            ).toEqual({ 'access-control-allow-origin': '*' });
        });
    });
});
