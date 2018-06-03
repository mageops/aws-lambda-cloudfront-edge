const { isError } = require('../../lib/responseHelper');

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
});
