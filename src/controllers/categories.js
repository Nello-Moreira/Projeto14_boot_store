import { internalErrorResponse } from '../helpers/helpers.js';

import { searchAllCategories } from '../data/categoriesTable.js';

const route = '/categories';

const getAllCategories = async (request, response) => {
	try {
		const categories = await searchAllCategories();

		if (categories.rowCount === 0) return response.sendStatus(204);

		const categoriesList = categories.rows.map((category) => category.name);

		return response.status(200).send(categoriesList);
	} catch (error) {
		return internalErrorResponse(response, error);
	}
};
const categories = { route, getAllCategories };

export default categories;
