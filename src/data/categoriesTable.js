import dbConnection from './connection.js';

const searchAllCategories = () =>
	dbConnection.query('SELECT name FROM categories ORDER BY name');

const searchAllCategoryProducts = (categoryName) =>
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
	WHERE categories.name = $1;
	`,
		[categoryName]
	);

const insertCategory = (categoryName) =>
	dbConnection.query(
		'INSERT INTO categories (name) values ($1) RETURNING id;',
		[categoryName]
	);

const deleteAllCategories = () => dbConnection.query('DELETE FROM categories');

export {
	searchAllCategories,
	searchAllCategoryProducts,
	insertCategory,
	deleteAllCategories,
};
