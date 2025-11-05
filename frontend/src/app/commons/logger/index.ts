import { formatDate } from "@commons/utils/formatDateTime";
import winston from "winston";
const { combine, timestamp, printf } = winston.format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});
const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), myFormat),
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.File({
      filename: `${process.cwd()}/public/logger/log-${formatDate(new Date(), "yyyy-MM-dd")}.log`,
    })
  );
}

export { logger };
