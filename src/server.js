import '../setup/dotenvSetup.js';
import express from 'express';
import cors from 'cors';

import status from './controllers/status.js';
import categories from './controllers/categories.js';
import products from './controllers/products.js';

const server = express();
server.use(cors());
server.use(express.json());

server.get(status.route, status.getStatus);

server.get(categories.route, categories.getAllCategories);

server.get(products.route, products.getProducts);

export default server;
