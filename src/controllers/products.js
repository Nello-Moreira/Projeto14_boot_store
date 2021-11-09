import { internalErrorResponse } from '../helpers/helpers.js';
import connection from '../data/connection.js';

const productsRoute = '/products';

async function getProducts(req, res) {
	const { page } = req.query;

	try {
		const offset = 16 * (page - 1) || 0;
		const products = await connection.query(
			'SELECT uuid, name, price, image_url FROM products OFFSET $1 LIMIT 16;',
			[offset]
		);
		if (products.rowCount) {
			const count = await connection.query(
				'SELECT COUNT(id) FROM products;'
			);
			products.rows[0].count = count.rows[0].count;
		}

		res.send(products.rows);
	} catch (error) {
		internalErrorResponse(res, error);
	}
}

export { productsRoute, getProducts };
