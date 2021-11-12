/* eslint-disable consistent-return */
import { insertCartProduct } from '../data/cartsProductsTable.js';
import { getToken } from '../data/sessionsTable.js';
import { internalErrorResponse } from '../helpers/helpers.js';
import validateProduct from '../validations/productValidation.js';
import validateUuid from '../validations/uuidValidation.js';

const route = '/carts/:id';

async function insertProductInCart(req, res) {
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
		const productValidation = validateProduct(req.body);
		if (productValidation.error) {
			return res
				.status(400)
				.send(productValidation.error.details[0].message);
		}
		await insertCartProduct(req.body);
		res.send();
	} catch (error) {
		internalErrorResponse(res, error);
	}
}

const carts = { route, insertProductInCart };

export default carts;
