describe('logger', () => {
    beforeEach(() => {
        jest.resetModules();
        delete process.env.AWS_EXECUTION_ENV;
    });

    test('logs to console when running on lambda', () => {
        process.env.AWS_EXECUTION_ENV = 'AWS_Lambda_nodejs8.10';

        const logger = require('../../lib/logger');

        expect(logger.log).toBe(console.log);
        expect(logger.error).toBe(console.error);
    });

    test('logs nowhere when running on lambda', () => {
        const logger = require('../../lib/logger');

        expect(logger.log).not.toBe(console.log);
        expect(logger.error).not.toBe(console.error);
    });
});
