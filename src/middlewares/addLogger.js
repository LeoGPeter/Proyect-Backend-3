import { logger } from '../logger/index.js';

export const addLogger = (req, res, next) => {
  req.logger = logger;
  logger.http(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
};
