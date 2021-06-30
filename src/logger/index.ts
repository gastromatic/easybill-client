import { createLogger, format, transports } from 'winston';

function formatParams(info: any) {
  const { timestamp, level, message, label } = info;

  return `${timestamp} [${level}]: invoice-service.${label} ${message}`;
}

const developmentFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
  format.align(),
  format.printf(formatParams),
);

const productionFormat = format.combine(
  format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
  format.align(),
  format.printf(formatParams),
);

const logger =
  process.env.NODE_ENV !== 'production'
    ? createLogger({
        defaultMeta: { component: 'invoice-service' },
        transports: [new transports.Console()],
        format: developmentFormat,
      })
    : createLogger({
        defaultMeta: { component: 'invoice-service' },
        format: productionFormat,
        transports: [new transports.Console()],
        exceptionHandlers: [new transports.Console()],
      });

export function log(options: { level: 'error' | 'info' | 'warn'; message: string; label: string }) {
  logger.log(options.level, options.message, { label: options.label });
}
