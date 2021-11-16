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

function getCartProduct(productId) {
	return dbConnection.query(
		'SELECT * FROM carts_products WHERE products_id = $1',
		[productId]
	);
}

function getAllProductsInCart(cartId) {
	return dbConnection.query(
		`
	SELECT products.id AS real_id, products.uuid AS id, products.name,
	carts_products.product_price AS price, products.image_url,
	carts_products.product_quantity AS "productQuantity"
	FROM products JOIN carts_products
	ON products.id = carts_products.products_id
	WHERE carts_products.cart_id = $1 AND carts_products.removed_at IS NULL
	`,
		[cartId]
	);
}

function removeProductFromCart(productId) {
	return dbConnection.query(
		`
		UPDATE carts_products
		SET removed_at = now()
		FROM carts
		WHERE carts_products.cart_id = carts.id AND
		products_id = $1 AND carts.payment_date IS NULL
	`,
		[productId]
	);
}

function changeProductQuantity(productId, productQuantity) {
	return dbConnection.query(
		`
		UPDATE carts_products
		SET product_quantity = $1
		FROM carts
		WHERE carts_products.cart_id = carts.id AND
		products_id = $2 AND carts.payment_date IS NULL
	`,
		[productQuantity, productId]
	);
}

function searchAllUserOrders(token) {
	return dbConnection.query(
		`
		SELECT
			products.uuid AS "productId", products.name, carts_products.product_quantity AS quantity, carts_products.product_price AS price, products.image_url, carts.payment_date AS "purchaseDate"
		FROM carts_products
		JOIN products ON carts_products.products_id = products.id
		JOIN carts ON carts_products.cart_id = carts.id
		JOIN users ON carts.user_id = users.id
		JOIN sessions ON sessions.user_id = users.id
		WHERE
			carts_products.removed_at IS NULL AND
			carts.payment_date IS NOT NULL AND
			sessions.token = $1
		ORDER BY "purchaseDate" DESC
		;
	`,
		[token]
	);
}

export {
	insertCartProduct,
	deleteAllCartProducts,
	getCartProduct,
	getAllProductsInCart,
	removeProductFromCart,
	changeProductQuantity,
	searchAllUserOrders,
};
