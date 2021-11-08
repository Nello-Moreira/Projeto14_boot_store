import { internalErrorResponse } from '../helpers/helpers.js';
import connection from '../data/connection.js';

const products = '/products';

async function getProducts(req, res) {
	try {
		const result = await connection.query('SELECT * FROM products;');
		res.send(result.rows);
	} catch (error) {
		internalErrorResponse(res, error);
	}
}

export { products, getProducts };
