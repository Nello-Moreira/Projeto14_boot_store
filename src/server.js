import '../setup/dotenvSetup.js';
import express from 'express';
import cors from 'cors';

import status from './controllers/status.js';
import categories from './controllers/categories.js';
import categoryProducts from './controllers/categoryProducts.js';
import allProducts from './controllers/allProducts.js';
import product from './controllers/product.js';
import signUp from './controllers/signUp.js';
import login from './controllers/login.js';
import logout from './controllers/logout.js';
import cart from './controllers/cart.js';
import checkout from './controllers/checkout.js';
import history from './controllers/history.js';

const server = express();
server.use(cors());
server.use(express.json());

server.get(status.route, status.getStatus);

server.get(categories.route, categories.getAllCategories);

server.get(categoryProducts.route, categoryProducts.getCategoryProducts);

server.get(allProducts.route, allProducts.getProducts);

server.get(product.route, product.getProductById);

server.post(signUp.route, signUp.postSignUp);

server.post(login.route, login.postLogin);

server.post(logout.route, logout.postLogout);

server.get(cart.route, cart.getCart);

server.post(cart.route, cart.insertProduct);

server.delete(`${cart.route}/:id`, cart.deleteProductInCart);

server.put(cart.route, cart.updateQuantity);

server.post(checkout.route, checkout.finishOrder);

server.get(history.route, history.getHistory);

export default server;
