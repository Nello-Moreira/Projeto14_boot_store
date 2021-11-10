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
	uuid AS id, name, description, price, color_id, image_url, category_id
	FROM products
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

export {
	queryProducts,
	queryCount,
	queryProductById,
	insertProduct,
	deleteAllProducts,
};
