/* eslint-disable consistent-return */
import { internalErrorResponse } from '../helpers/helpers.js';
import { queryProductById } from '../data/productsQuery.js';

const productRoute = '/products/:id';

async function getProductById(req, res) {
	const uuid = req.params.id;
	try {
		const product = await queryProductById(uuid);
		if (!product.rowCount) {
			return res.sendStatus(404);
		}
		res.send(product.rows[0]);
	} catch (error) {
		if (error.message.includes('invalid input syntax for type uuid')) {
			res.status(500).send(
				'There was an internal error. Please try again later.'
			);
		} else {
			internalErrorResponse(res, error);
		}
	}
}

export { productRoute, getProductById };
