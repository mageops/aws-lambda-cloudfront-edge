describe('gzip compress', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns a promise', () => {
        const compress = require('../../../lib/gzip/compress');

        expect(typeof compress('').then).toBe('function');
    });

    test('resolves a promise with Buffer object', async () => {
        const compress = require('../../../lib/gzip/compress');
        const buffer = await compress('');

        expect(buffer instanceof Buffer).toBe(true);
    });

    test('rejects the promise when gzip errors', async () => {
        jest.mock('zlib', () => {
            return {
                gzip: jest.fn((input, options, callback) =>
                    callback(new Error('Error'))
                ),
            };
        });

        const compress = require('../../../lib/gzip/compress');

        expect(compress('')).rejects.toThrow('Error');
    });

    test('result output is smaller then input', async () => {
        const compress = require('../../../lib/gzip/compress');
        const input = 'test input to compress';
        const output = await compress(input).toString();

        expect(output.length).toBeLessThan(input.length);
    });
});
