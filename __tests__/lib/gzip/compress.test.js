describe('gzip compress', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns a promise', async () => {
        const compress = require('../../../lib/gzip/compress');

        const result = compress('');
        expect(typeof result.then).toBe('function');
        await result;
    });

    test('resolves a promise with Buffer object', async () => {
        const compress = require('../../../lib/gzip/compress');
        const buffer = await compress('');

        expect(buffer instanceof Buffer).toBe(true);
    });

    test('rejects the promise when gzip errors', async () => {
        const compress = require('../../../lib/gzip/compress');

        await expect(compress(-1)).rejects.toThrow('Received type number');
    });

    test('result output is smaller then input', async () => {
        const compress = require('../../../lib/gzip/compress');
        const input =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        const output = (await compress(input)).toString();

        expect(output.length).toBeLessThan(input.length);
    });
});
