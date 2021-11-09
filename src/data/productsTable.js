import dbConnection from './connection.js';

function queryProducts(offset) {
	return dbConnection.query(
		'SELECT id, uuid, name, price, image_url FROM products OFFSET $1 LIMIT 16;',
		[offset]
	);
}

function queryCount() {
	return dbConnection.query('SELECT COUNT(id) FROM products;');
}

function queryProductById(uuid) {
	return dbConnection.query('SELECT * FROM products WHERE uuid = $1', [uuid]);
}

const insertProduct = async (product) => {
	const result = await dbConnection.query(
		`
    INSERT INTO products
    (uuid, name, description, price, color_id, image_url, category_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING uuid;`,
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
	return result.rows[0].uuid;
};

const deleteAllProducts = () => dbConnection.query('DELETE FROM products;');

export {
	queryProducts,
	queryCount,
	queryProductById,
	insertProduct,
	deleteAllProducts,
};
