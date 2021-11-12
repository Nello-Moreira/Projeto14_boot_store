/* eslint-disable consistent-return */
import { v4 as uuid } from 'uuid';
import { internalErrorResponse } from '../helpers/helpers.js';
import { insertCart, queryOpenCart } from '../data/cartsTable.js';
import { queryProductById } from '../data/productsTable.js';
import { getToken } from '../data/sessionsTable.js';
import validateUuid from '../validations/uuidValidation.js';
import {
	insertCartProduct,
	getAllProductsInCart,
} from '../data/cartsProductsTable.js';

const route = '/cart';

async function getCart(req, res) {
	const token = req.headers.authorization?.replace('Bearer ', '');
	const tokenValidation = validateUuid(token);
	if (tokenValidation.error) {
		return res.sendStatus(400);
	}

	try {
		if (!token) {
			return res.sendStatus(401);
		}
		const result = await getToken(token);
		if (!result.rowCount) {
			return res.sendStatus(401);
		}

		const openCart = await queryOpenCart(result.rows[0].id);

		if (!openCart.rowCount) {
			return res.send([]);
		}
		const cartId = openCart.rows[0].id;
		const products = await getAllProductsInCart(cartId);
		res.send(products.rows);
	} catch (error) {
		internalErrorResponse(res, error);
	}
}

async function insertProduct(req, res) {
	const token = req.headers.authorization?.replace('Bearer ', '');
	const tokenValidation = validateUuid(token);
	if (tokenValidation.error) {
		return res.sendStatus(400);
	}
	try {
		if (!token) {
			return res.sendStatus(401);
		}
		const result = await getToken(token);
		if (!result.rowCount) {
			return res.sendStatus(401);
		}
		const bodyValidation = validateUuid(req.body.uuid);
		if (bodyValidation.error) {
			return res
				.status(400)
				.send(bodyValidation.error.details[0].message);
		}

		const productResult = await queryProductById(req.body.uuid);
		if (!productResult.rowCount) {
			return res.status(404).send(`Product doesn't exist`);
		}
		const productId = productResult.rows[0].real_id;
		const productPrice = productResult.rows[0].price;

		const openCart = await queryOpenCart(result.rows[0].id);
		let cartId;
		if (!openCart.rowCount) {
			const cart = {
				uuid: uuid(),
				user_id: result.rows[0].id,
				payment_date: null,
			};
			const cartInsertion = await insertCart(cart);
			cartId = cartInsertion.rows[0].id;
		} else {
			cartId = openCart.rows[0].id;
		}

		const cartProduct = {
			cart_id: cartId,
			products_id: productId,
			product_quantity: 1,
			product_price: productPrice,
			removed_at: null,
		};

		await insertCartProduct(cartProduct);
		res.send();
	} catch (error) {
		internalErrorResponse(res, error);
	}
}

const cart = { route, getCart, insertProduct };
export default cart;
