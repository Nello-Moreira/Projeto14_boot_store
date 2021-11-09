import { internalErrorResponse } from '../helpers/helpers.js';

import { searchAllCategoryProducts } from '../data/categoriesTable.js';

const route = '/category/:name';

const getAllCategoryProducts = async (request, response) => {
	const categoryName = request.params.name;

	try {
		const products = await searchAllCategoryProducts(categoryName);

		if (products.rowCount === 0) return response.sendStatus(204);

		return response.status(200).send(products.rows);
	} catch (error) {
		return internalErrorResponse(response, error);
	}
};
const categoryProducts = { route, getAllCategoryProducts };

export default categoryProducts;
