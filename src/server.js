import express from 'express';
import mocksRouter from './routes/mocks.router.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { connectMongo } from './config/mongo.js';

const app = express();

app.use(express.json());

app.use('/api/mocks', mocksRouter);

// Manejador de errores general
app.use(errorHandler);

app.listen(8080, () => {
  console.log('Server running on port 8080');
});

connectMongo();