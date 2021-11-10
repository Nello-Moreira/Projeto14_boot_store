import { insertCartProduct } from '../data/cartsProductsTable.js';
import { internalErrorResponse } from '../helpers/helpers.js';

const cartRoute = '/carts/:id';

async function insertProductInCart(req, res) {
	try {
		await insertCartProduct(req.body);
		res.send();
	} catch (error) {
		internalErrorResponse(res, error);
	}
}

export { insertProductInCart, cartRoute };
