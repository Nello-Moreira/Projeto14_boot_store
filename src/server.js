import '../setup/dotenvSetup.js';
import express from 'express';
import cors from 'cors';

import exampleRoute from './routes/exampleRoute.js';

const server = express();
server.use(cors());
server.use(express.json());

server.get(exampleRoute.route, exampleRoute.getRoute);

export default server;
