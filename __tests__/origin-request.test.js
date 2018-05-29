const originRequest = require('../origin-request');

describe('origin-request handler', () => {
    test('returns handler function', () => {
        expect(typeof originRequest.handler).toBe('function');
    });
});
