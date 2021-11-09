/* eslint-disable consistent-return */
import { internalErrorResponse } from '../helpers/helpers.js';
import { queryProductById } from '../data/productsTable.js';
import validateUuid from '../validation/uuidValidation.js';

const productRoute = '/products/:id';

async function getProductById(req, res) {
	const uuid = req.params.id;

	try {
		const validation = validateUuid(uuid);
		if (validation.error) {
			return res.sendStatus(400);
		}
		const product = await queryProductById(uuid);
		if (!product.rowCount) {
			return res.sendStatus(404);
		}
		res.send(product.rows[0]);
	} catch (error) {
		internalErrorResponse(res, error);
	}
}

export { productRoute, getProductById };
