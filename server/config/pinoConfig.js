const pino = require("pino");

/**
 * Configures and creates a Pino logger instance.
 * The logger is configured to use the "pino-pretty" transport, which formats logs in a human-readable way.
 * It also includes the timestamp in the log output and sets the minimum log level to "info".
 *
 * @type {pino.Logger}
 * @example
 * const { pinoLog } = require('./pinoConfig');
 *
 * // Log an info message
 * pinoLog.info('This is an info message');
 *
 * // Log an error message
 * pinoLog.error('This is an error message');
 */

const pinoLog = pino({
	transport: {
		target: "pino-pretty",
	},
});

module.exports = { pinoLog };
