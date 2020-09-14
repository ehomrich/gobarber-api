import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';

import uploadConfig from './config/upload';
import errorHandler from './middlewares/errorHandler';
import routes from './routes';

import './database';

const app = express();

app.use(express.json());
app.use('/static', express.static(uploadConfig.directory));
app.use(routes);

app.use(errorHandler);

app.listen(3333, () => console.log('Server listening on port 3333'));
