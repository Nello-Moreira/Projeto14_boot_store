/* eslint-disable consistent-return */
import { v4 as uuid } from 'uuid';
import { internalErrorResponse } from '../helpers/helpers';
import { insertCart } from '../data/cartsTable';
import { getToken } from '../data/sessionsTable';
import validateUuid from '../validations/uuidValidation';

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

const cart = { route, createCart };
export default cart;
