import dbConnection from './connection.js';

import { productsPerPage } from '../helpers/helpers.js';

const checkIfCategoryExists = async (categoryName) => {
	const queryResult = await dbConnection.query(
		'SELECT * FROM categories WHERE name = $1',
		[categoryName]
	);

	if (queryResult.rowCount > 0) return true;
	return false;
};

const searchAllCategories = () =>
	dbConnection.query('SELECT name FROM categories ORDER BY name');

const searchCategoryProducts = (categoryName, offset) =>
	dbConnection.query(
		`
	SELECT 
		products.uuid AS id, products.name, products.description, products.price, colors.name AS color, products.image_url
	FROM 
		products
	JOIN categories
		ON (categories.id = products.category_id)
	JOIN colors
		ON (colors.id = products.color_id)
	WHERE categories.name = $1
	OFFSET $2
	LIMIT ${productsPerPage};
	`,
		[categoryName, offset]
	);

const categoryProductsCount = (categoryName) =>
	dbConnection.query(
		`SELECT COUNT(products.id) 
		FROM products 
		JOIN categories
			ON (categories.id = products.category_id)
		WHERE categories.name = $1;`,
		[categoryName]
	);

const insertCategory = (categoryName) =>
	dbConnection.query(
		'INSERT INTO categories (name) values ($1) RETURNING id;',
		[categoryName]
	);

const deleteAllCategories = () => dbConnection.query('DELETE FROM categories');

export {
	checkIfCategoryExists,
	searchAllCategories,
	searchCategoryProducts,
	categoryProductsCount,
	insertCategory,
	deleteAllCategories,
};
