import dbConnection from './connection.js';

const insertProduct = (product) =>
	dbConnection.query(
		`
    INSERT INTO products
    (uuid, name, description, price, color_id, image_url, category_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7) ;`,
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

export { insertProduct, deleteAllProducts };
