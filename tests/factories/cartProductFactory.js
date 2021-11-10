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

export default cartProductFactory;
