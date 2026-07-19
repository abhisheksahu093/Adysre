/**
 * Structured logging for ADYSRE (backend rule: "structured logging everywhere").
 * Wraps pino with a consistent base and tenant/request-scoped child loggers.
 */
import pino, { type Logger, type LoggerOptions } from 'pino';

const isProd = process.env.NODE_ENV === 'production';

const options: LoggerOptions = {
  level: process.env.LOG_LEVEL ?? (isProd ? 'info' : 'debug'),
  base: { service: 'adysre' },
  redact: {
    paths: ['req.headers.authorization', '*.password', '*.token', '*.refreshToken'],
    censor: '[redacted]',
  },
};

// pino-pretty is dev-only; omit `transport` entirely in production.
if (!isProd) {
  options.transport = {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:standard' },
  };
}

export const logger: Logger = pino(options);

export interface LogContext {
  tenantId?: string;
  userId?: string;
  requestId?: string;
  module?: string;
}

/** Create a child logger bound to a tenant/request/module context. */
export function createLogger(context: LogContext): Logger {
  return logger.child(context);
}

export type { Logger };
