import { searchAllUserOrders } from '../data/cartsProductsTable.js';
import { internalErrorResponse } from '../helpers/helpers.js';
import { getToken } from '../data/sessionsTable.js';
import validateUuid from '../validations/uuidValidation.js';

const route = '/history';

const getHistory = async (request, response) => {
	const bearerToken = request.headers.authorization;
	const token = bearerToken.replace('Bearer ', '');

	const sessionValidationError = validateUuid(token).error;

	if (sessionValidationError) {
		return response.status(400).send(sessionValidationError.message);
	}

	try {
		if ((await getToken(token)).rowCount === 0) {
			return response.sendStatus(404);
		}
		const orderHistory = await searchAllUserOrders(token);

		return response.status(200).send(orderHistory.rows);
	} catch (error) {
		return internalErrorResponse(response, error);
	}
};

const history = { route, getHistory };

export default history;
