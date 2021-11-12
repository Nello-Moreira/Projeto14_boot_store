import faker from 'faker';
faker.locale = 'pt_BR';

function cartProductFactory(cartId, productId) {
	return {
		cart_id: cartId,
		products_id: productId,
		product_quantity: faker.datatype.number(),
		product_price: faker.commerce.price(),
		removed_at: null,
	};
}

function incorrectCartProductFactory(cartId, productId) {
	return {
		cart_id: cartId,
		products_id: productId,
		product_quantity: faker.datatype.string(),
		product_price: faker.datatype.string(),
		removed_at: faker.datatype.uuid(),
	};
}

export { cartProductFactory, incorrectCartProductFactory };
