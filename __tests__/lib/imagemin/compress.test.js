const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

describe('imagemin compress', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns a promise', async () => {
        const input = await readFileAsync(
            path.resolve(__dirname, './image-jpg.jpg')
        );
        const compress = require('../../../lib/imagemin/compress');

        const result = compress(input);
        expect(typeof result.then).toBe('function');
        await result;
    });

    test('resolves a promise with Buffer object', async () => {
        const input = await readFileAsync(
            path.resolve(__dirname, './image-jpg.jpg')
        );
        const compress = require('../../../lib/imagemin/compress');
        const output = await compress(input);

        expect(output instanceof Buffer).toBe(true);
    });

    test('result output is smaller then input for jpg', async () => {
        const input = await readFileAsync(
            path.resolve(__dirname, './image-jpg.jpg')
        );
        const compress = require('../../../lib/imagemin/compress');
        const output = await compress(input);

        expect(output.length).toBeLessThan(input.length);
    });

    test('result output is smaller then input for png', async () => {
        const input = await readFileAsync(
            path.resolve(__dirname, './image-png.png')
        );
        const compress = require('../../../lib/imagemin/compress');
        const output = await compress(input);

        expect(output.length).toBeLessThan(input.length);
    });

    test('result output is smaller then input for gif', async () => {
        const input = await readFileAsync(
            path.resolve(__dirname, './image-gif.gif')
        );
        const compress = require('../../../lib/imagemin/compress');
        const output = await compress(input);

        expect(output.length).toBeLessThan(input.length);
    });

    test('result output is the same size as input for svg', async () => {
        const input = await readFileAsync(
            path.resolve(__dirname, './image-svg.svg')
        );
        const compress = require('../../../lib/imagemin/compress');
        const output = await compress(input);

        expect(output.length).toBe(input.length);
    });
});
