import express from 'express';
import mocksRouter from './routes/mocks.router.js';
import usersRouter from './routes/users.router.js';
import sessionsRouter from './routes/sessions.router.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { connectMongo } from './config/mongo.js';
import { addLogger } from './middlewares/addLogger.js';
import session from 'express-session';

const app = express();

app.use(express.json());
app.use(addLogger);
app.use(session({
  secret: 'supersecreto', // podés mover esto a env
  resave: false,
  saveUninitialized: false
}));

app.use('/api/mocks', mocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);

// Manejador de errores general
app.use(errorHandler);

app.listen(8080, () => {
  console.log('Server running on port 8080');
});

connectMongo();