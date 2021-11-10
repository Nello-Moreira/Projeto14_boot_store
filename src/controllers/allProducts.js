import {
	productsPerPage,
	getOffset,
	internalErrorResponse,
} from '../helpers/helpers.js';

import { queryProducts, queryCount } from '../data/productsTable.js';

const route = '/products';

async function getProducts(req, res) {
	const { page } = req.query;

	try {
		const products = await queryProducts(getOffset(page));

		if (products.rowCount) {
			const productsCount = await queryCount();

			return res.send({
				pagesCount: Math.ceil(
					productsCount.rows[0].count / productsPerPage
				),
				products: products.rows,
			});
		}
		return res.send(products.rows);
	} catch (error) {
		return internalErrorResponse(res, error);
	}
}

const allProducts = { route, getProducts };

export default allProducts;
