import dbConnection from './connection';

function insertCart(cart) {
	return dbConnection.query(
		`
    INSERT INTO carts (uuid, user_id, payment_date)
    VALUES ($1, $2, $3) RETURNING id;
    `,
		[cart.uuid, cart.user_id, cart.payment_date]
	);
}

function deleteAllCarts() {
	return dbConnection.query('DELETE FROM carts;');
}

function getCart(userId) {
	return dbConnection.query('SELECT * FROM carts WHERE user_id = $1', [
		userId,
	]);
}

export { insertCart, deleteAllCarts, getCart };
