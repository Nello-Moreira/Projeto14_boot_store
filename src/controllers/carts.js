/* eslint-disable consistent-return */
import { insertCartProduct } from '../data/cartsProductsTable.js';
import { getToken } from '../data/sessionsTable.js';
import { internalErrorResponse } from '../helpers/helpers.js';
import validateProduct from '../validation/productValidation.js';

const route = '/carts/:id';

async function insertProductInCart(req, res) {
	const token = req.headers.authorization?.replace('Bearer ', '');
	try {
		if (!token) {
			return res.sendStatus(401);
		}
		const result = await getToken(token);
		if (!result.rowCount) {
			return res.sendStatus(401);
		}
		const validation = validateProduct(req.body);
		if (validation.error) {
			return res.status(400).send(validation.error.details[0].message);
		}
		await insertCartProduct(req.body);
		res.send();
	} catch (error) {
		internalErrorResponse(res, error);
	}
}

const carts = { route, insertProductInCart };

export default carts;
