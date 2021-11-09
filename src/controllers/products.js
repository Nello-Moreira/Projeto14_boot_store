/* eslint-disable consistent-return */
import { internalErrorResponse } from '../helpers/helpers.js';
import { queryProducts, queryCount } from '../data/productsQuery.js';

const productsRoute = '/products';

async function getProducts(req, res) {
	const { page } = req.query;

	try {
		const offset = 16 * (page - 1) || 0;
		const products = await queryProducts(offset);
		if (products.rowCount) {
			const count = await queryCount();
			return res.send({
				count: count.rows[0].count,
				products: products.rows,
			});
		}
		res.send(products.rows);
	} catch (error) {
		internalErrorResponse(res, error);
	}
}

export { productsRoute, getProducts };
