import dbConnection from './connection.js';

function insertCartProduct(cartProduct) {
	return dbConnection.query(
		`
    INSERT INTO carts_products (cart_id, products_id, product_quantity, product_price, removed_at)
    VALUES ($1, $2, $3, $4, $5);
    `,
		[
			cartProduct.cart_id,
			cartProduct.products_id,
			cartProduct.product_quantity,
			cartProduct.product_price,
			cartProduct.removed_at,
		]
	);
}

function deleteAllCartProducts() {
	return dbConnection.query('DELETE FROM carts_products;');
}

function getCartProduct(productId, cartId) {
	return dbConnection.query(
		'SELECT * FROM carts_products WHERE products_id = $1 AND cart_id = $2',
		[productId, cartId]
	);
}

export { insertCartProduct, deleteAllCartProducts, getCartProduct };
