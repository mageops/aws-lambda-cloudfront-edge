const compress = require('../../../lib/brotli/compress');

describe('brotli compress', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns a promise', () => {
        expect(typeof compress('').then).toBe('function');
    });

    test('resolves a promise with Buffer object', async () => {
        const buffer = await compress('');

        expect(buffer instanceof Buffer).toBe(true);
    });

    test('result output is smaller then input', async () => {
        const input = 'test input to compress';
        const output = await compress(input).toString();

        expect(output.length).toBeLessThan(input.length);
    });

    test('works for Buffer input', async () => {
        const input = Buffer.from('test input to compress');

        const output = await compress(input);
        expect(output).toBeTruthy();
    });

    test('works for string input', async () => {
        const input = 'test input to compress';

        const output = await compress(input);
        expect(output).toBeTruthy();
    });

    test('result output is smaller then input', async () => {
        const input = 'test input to compress';
        const output = await compress(input).toString();

        expect(output.length).toBeLessThan(input.length);
    });
});
