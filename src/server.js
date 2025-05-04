import { connectMongo } from './config/mongo.js';
import app from './app.js';
import { logger } from './logger/index.js';

const PORT = process.env.PORT || 8080;

connectMongo().then(() => {
  app.listen(PORT, () => {
    logger.info(`Servidor ON en http://localhost:${PORT}`);
  });
});