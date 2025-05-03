import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mocksRouter from './routes/mocks.router.js';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import sessionsRouter from './routes/sessions.router.js';
import adoptionsRouter from './routes/adoptions.router.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { addLogger } from './middlewares/addLogger.js';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();
const swaggerDoc = YAML.load('./src/docs/swagger.yaml');

app.use(express.json());
app.use(addLogger);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));
  
app.use('/api/mocks', mocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/adoptions', adoptionsRouter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(errorHandler);

export default app;
