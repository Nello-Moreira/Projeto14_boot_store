import { internalErrorResponse } from '../helpers/helpers.js';

import searchAllCategories from '../data/categoriesTable.js';

const route = '/categories';

const getAllCategories = async (request, response) => {
	try {
		const categories = await searchAllCategories();
		const categoriesList = categories.rows.map((category) => category.name);
		response.status(200).send(categoriesList);
	} catch (error) {
		internalErrorResponse(response, error);
	}
};
const categories = { route, getAllCategories };

export default categories;
