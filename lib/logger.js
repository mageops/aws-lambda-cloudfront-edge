/**
 * Module responsible for logging.
 * Is is used as an adapter to be able to silence all logs during testing.
 */

const shouldLog = process.env.AWS_EXECUTION_ENV;

const logger = shouldLog
    ? {
          log: console.log,
          error: console.error,
      }
    : {
          log: () => {},
          error: () => {},
      };

module.exports = logger;
