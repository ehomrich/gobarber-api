import 'reflect-metadata';
import express from 'express';

import uploadConfig from './config/upload';
import routes from './routes';

import './database';

const app = express();

app.use(express.json());
app.use('/static', express.static(uploadConfig.directory));
app.use(routes);

app.listen(3333, () => console.log('Server listening on port 3333'));
