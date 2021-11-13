import dbConnection from './connection.js';

import { productsPerPage } from '../helpers/helpers.js';

function queryProducts(offset) {
	return dbConnection.query(
		`SELECT
		uuid as id, name, price, image_url
		FROM products
		OFFSET $1
		LIMIT ${productsPerPage};`,
		[offset]
	);
}

function queryCount() {
	return dbConnection.query('SELECT COUNT(id) FROM products;');
}

function queryProductById(uuid) {
	return dbConnection.query(
		`
	SELECT
	products.id AS real_id,
	products.uuid AS id, products.name,
	products.description, products.price, colors.name AS color,
	image_url, categories.name AS category
	FROM products JOIN colors
		ON products.color_id = colors.id
	JOIN categories
		ON products.category_id = categories.id
	WHERE uuid = $1`,
		[uuid]
	);
}

const insertProduct = (product) =>
	dbConnection.query(
		`
    INSERT INTO products
    (uuid, name, description, price, color_id, image_url, category_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7);`,
		[
			product.uuid,
			product.name,
			product.description,
			product.price,
			product.color_id,
			product.image_url,
			product.category_id,
		]
	);

const deleteAllProducts = () => dbConnection.query('DELETE FROM products;');

function getProductIdByUuid(uuid) {
	return dbConnection.query('SELECT id FROM products WHERE uuid = $1', [
		uuid,
	]);
}

export {
	queryProducts,
	queryCount,
	queryProductById,
	insertProduct,
	deleteAllProducts,
	getProductIdByUuid,
};
