import '../setup/dotenvSetup.js';
import express from 'express';
import cors from 'cors';
import { productsRoute, getProducts } from './controllers/products.js';
import { productRoute, getProductById } from './controllers/product.js';
import { cartRoute, insertProductInCart } from './controllers/carts.js';

const server = express();
server.use(cors());
server.use(express.json());

server.get(productsRoute, getProducts);
server.get(productRoute, getProductById);
server.post(cartRoute, insertProductInCart);

export default server;
