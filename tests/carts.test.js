import supertest from 'supertest';
import server from '../src/server.js';
import endConnection from '../src/helpers/endConnection.js';

import {
	insertProduct,
	deleteAllProducts,
	getProductIdByUuid,
} from '../src/data/productsTable.js';
import { insertCart, deleteAllCarts } from '../src/data/cartsTable.js';
import {
	insertCartProduct,
	deleteAllCartProducts,
	getCartProduct,
} from '../src/data/cartsProductsTable.js';
import {
	deleteAllCategories,
	insertCategory,
} from '../src/data/categoriesTable.js';
import { deleteAllColors, insertColor } from '../src/data/colorsTable.js';
import { insertUser, deleteAllUsers } from '../src/data/usersTable.js';
import { insertSession, deleteAllSessions } from '../src/data/sessionsTable.js';

import categoryFactory from './factories/categoryFactory.js';
import colorFactory from './factories/colorFactory.js';
import { productFactory } from './factories/productFactory.js';
import { openCartFactory, closedCartFactory } from './factories/cartFactory.js';
import cartProductFactory from './factories/cartProductFactory.js';
import userFactory from './factories/userFactory.js';
import sessionFactory from './factories/sessionFactory.js';

afterAll(() => {
	endConnection();
});

describe('post /carts/:id', () => {
	const fakeColor = colorFactory();
	const fakeCategory = categoryFactory();
	let fakeProduct;
	const fakeUser = userFactory();
	let fakeSession;
	let fakeCart;

	beforeAll(async () => {
		await deleteAllCartProducts();
		await deleteAllProducts();
		await deleteAllCategories();
		await deleteAllColors();
		await deleteAllCarts();
		await deleteAllSessions();
		await deleteAllUsers();

		fakeColor.id = (await insertColor(fakeColor.name)).rows[0].id;
		fakeCategory.id = (await insertCategory(fakeCategory.name)).rows[0].id;
		fakeProduct = productFactory(fakeColor.id, fakeCategory.id);
		fakeUser.id = (await insertUser(fakeUser)).rows[0].id;
		fakeSession = sessionFactory(fakeUser.id);
		fakeCart = openCartFactory(fakeUser.id);
		fakeCart.id = (await insertCart(fakeCart)).rows[0].id;

		await insertProduct(fakeProduct);
		await insertSession(fakeSession);
	});

	it('returns 200 and adds a product to the cart when it is an existent product', async () => {
		const productId = (await getProductIdByUuid(fakeProduct.uuid)).rows[0]
			.id;
		const fakeCartProduct = cartProductFactory(fakeCart.id, productId);

		const result = await supertest(server)
			.post(`/carts/${fakeCart.uuid}`)
			.send(fakeCartProduct)
			.set('Authorization', `Bearer ${fakeSession.token}`);
		const registeredProduct = await getCartProduct(productId, fakeCart.id);
		expect(result.status).toEqual(200);
		expect(registeredProduct.rowCount).toEqual(1);
		expect(registeredProduct.rows[0]).toHaveProperty('id');
		expect(registeredProduct.rows[0]).toHaveProperty('cart_id');
		expect(registeredProduct.rows[0]).toHaveProperty('products_id');
		expect(registeredProduct.rows[0]).toHaveProperty('product_quantity');
		expect(registeredProduct.rows[0]).toHaveProperty('product_price');
		expect(registeredProduct.rows[0]).toHaveProperty('removed_at');
	});
});
