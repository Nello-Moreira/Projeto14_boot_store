import connection from './connection.js';

function queryProducts(offset) {
	return connection.query(
		'SELECT id, uuid, name, price, image_url FROM products OFFSET $1 LIMIT 16;',
		[offset]
	);
}

function queryCount() {
	return connection.query('SELECT COUNT(id) FROM products;');
}

export { queryProducts, queryCount };
