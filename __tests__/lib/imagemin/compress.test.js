const fs = require('fs');
const path = require('path');

describe('imagemin compress', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('returns a promise', () => {
        const input = fs.readFileSync(
            path.resolve(__dirname, './image-jpg.jpg')
        );
        const compress = require('../../../lib/imagemin/compress');

        expect(typeof compress(input).then).toBe('function');
    });

    test('resolves a promise with Buffer object', async () => {
        const input = fs.readFileSync(
            path.resolve(__dirname, './image-jpg.jpg')
        );
        const compress = require('../../../lib/imagemin/compress');
        const output = await compress(input);

        expect(output instanceof Buffer).toBe(true);
    });

    test('result output is smaller then input for jpg', async () => {
        const input = fs.readFileSync(
            path.resolve(__dirname, './image-jpg.jpg')
        );
        const compress = require('../../../lib/imagemin/compress');
        const output = await compress(input);

        expect(output.length).toBeLessThan(input.length);
    });

    test('result output is smaller then input for png', async () => {
        const input = fs.readFileSync(
            path.resolve(__dirname, './image-png.png')
        );
        const compress = require('../../../lib/imagemin/compress');
        const output = await compress(input);

        expect(output.length).toBeLessThan(input.length);
    });

    test('result output is smaller then input for gif', async () => {
        const input = fs.readFileSync(
            path.resolve(__dirname, './image-gif.gif')
        );
        const compress = require('../../../lib/imagemin/compress');
        const output = await compress(input);

        expect(output.length).toBeLessThan(input.length);
    });

    test('result output is smaller then input for svg', async () => {
        const input = fs.readFileSync(
            path.resolve(__dirname, './image-svg.svg')
        );
        const compress = require('../../../lib/imagemin/compress');
        const output = await compress(input);

        expect(output.length).toBeLessThan(input.length);
    });
});
