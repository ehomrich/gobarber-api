import 'reflect-metadata';
import '@shared/infra/typeorm';

import express from 'express';
import 'express-async-errors';

import '@shared/container';

import uploadConfig from '@config/upload';
import errorHandler from '@shared/infra/http/middlewares/errorHandler';
import routes from '@shared/infra/http/routes';

const app = express();

app.use(express.json());
app.use('/static', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errorHandler);

app.listen(3333, () => console.log('Server listening on port 3333'));
