import { internalErrorResponse } from '../helpers/helpers.js';
import validateUuid from '../validations/uuidValidation.js';
import { getToken } from '../data/sessionsTable.js';
import { closeCart, getOpenCart } from '../data/cartsTable.js';

const route = '/checkout';

async function finishOrder(req, res) {
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
		const cart = await getOpenCart(result.rows[0].id);
		if (!cart.rowCount) {
			return res.status(404).send(`this cart doesn't exist`);
		}
		await closeCart(cart.rows[0].id);
		return res.send();
	} catch (error) {
		return internalErrorResponse(res, error);
	}
}

const checkout = { route, finishOrder };

export default checkout;
