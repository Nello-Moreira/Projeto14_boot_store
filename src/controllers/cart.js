/* eslint-disable consistent-return */
import { v4 as uuid } from 'uuid';
import { internalErrorResponse } from '../helpers/helpers.js';
import { insertCart, queryOpenCart } from '../data/cartsTable.js';
import { getToken } from '../data/sessionsTable.js';
import validateUuid from '../validations/uuidValidation.js';

const route = '/cart';

async function createCart(req, res) {
	const token = req.headers.authorization?.replace('Bearer ', '');
	const uuidValidation = validateUuid(token);
	if (uuidValidation.error) {
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
		const cart = {
			uuid: uuid(),
			user_id: result.rows[0].id,
			payment_date: null,
		};
		const cartInsertion = await insertCart(cart);
		res.send({ id: cartInsertion.rows[0].id });
	} catch (error) {
		internalErrorResponse(res, error);
	}
}

async function getOpenCart(req, res) {
	const token = req.headers.authorization?.replace('Bearer ', '');
	const uuidValidation = validateUuid(token);
	if (uuidValidation.error) {
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
		res.send(openCart.rows[0]);
	} catch (error) {
		internalErrorResponse(res, error);
	}
}

const cart = { route, createCart, getOpenCart };
export default cart;
