import {
	productsPerPage,
	getOffset,
	internalErrorResponse,
} from '../helpers/helpers.js';

import {
	checkIfCategoryExists,
	searchCategoryProducts,
	categoryProductsCount,
} from '../data/categoriesTable.js';

import pageSchema from '../validations/pageNumberValidation.js';
import categoryNameSchema from '../validations/categoryNameValidation.js';

const route = '/category/:name';

const getCategoryProducts = async (request, response) => {
	const categoryName = request.params.name;
	const { page } = request.query;

	const pageValidationError = pageSchema.validate({ page }).error;

	if (pageValidationError) {
		return response.status(400).send(pageValidationError.message);
	}

	const categoryNameValidationError = categoryNameSchema.validate({
		categoryName,
	}).error;

	if (categoryNameValidationError) {
		return response.status(400).send(categoryNameValidationError.message);
	}

	try {
		const categoryExists = await checkIfCategoryExists(categoryName);

		if (!categoryExists) {
			return response
				.status(404)
				.send("The requested category doesn't exist");
		}

		const products = await searchCategoryProducts(
			categoryName,
			getOffset(page)
		);

		if (products.rowCount === 0) return response.sendStatus(204);

		const productsCount = await categoryProductsCount(categoryName);

		return response.status(200).send({
			pagesCount: Math.ceil(
				productsCount.rows[0].count / productsPerPage
			),
			products: products.rows,
		});
	} catch (error) {
		return internalErrorResponse(response, error);
	}
};
const categoryProducts = { route, getCategoryProducts };

export default categoryProducts;
