import { internalErrorResponse } from '../helpers/helpers.js';
import { queryProductById } from '../data/productsTable.js';
import validateUuid from '../validations/uuidValidation.js';

const route = '/products/:id';

async function getProductById(req, res) {
	const uuid = req.params.id;

	const validation = validateUuid(uuid);
	if (validation.error) {
		return res.sendStatus(400);
	}

	try {
		const product = await queryProductById(uuid);
		if (!product.rowCount) {
			return res.sendStatus(404);
		}
		return res.send(product.rows[0]);
	} catch (error) {
		return internalErrorResponse(res, error);
	}
}

const product = {
	route,
	getProductById,
};

export default product;
