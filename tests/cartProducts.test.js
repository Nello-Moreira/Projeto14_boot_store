import supertest from 'supertest';
import server from '../src/server.js';
import endConnection from '../src/helpers/endConnection.js';
import cartProducts from '../src/controllers/cartProducts.js';

import {
	insertProduct,
	deleteAllProducts,
	getProductIdByUuid,
} from '../src/data/productsTable.js';
import { insertCart, deleteAllCarts } from '../src/data/cartsTable.js';
import {
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
import productFactory from './factories/productFactory.js';
import uuidFactory from './factories/uuidFactory.js';
import stringFactory from './factories/stringFactory.js';
import openCartFactory from './factories/cartFactory.js';
import {
	cartProductFactory,
	incorrectCartProductFactory,
} from './factories/cartProductFactory.js';
import userFactory from './factories/userFactory.js';
import sessionFactory from './factories/sessionFactory.js';

afterAll(() => {
	endConnection();
});

describe('post /cartProducts', () => {
	const fakeColor = colorFactory();
	const fakeCategory = categoryFactory();
	let fakeProduct;
	const fakeUser = userFactory();
	let fakeSession;
	let fakeCart;
	let productId;

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

		productId = (await getProductIdByUuid(fakeProduct.uuid)).rows[0].id;
	});

	afterAll(async () => {
		await deleteAllCartProducts();
		await deleteAllProducts();
		await deleteAllCategories();
		await deleteAllColors();
		await deleteAllCarts();
		await deleteAllSessions();
		await deleteAllUsers();
	});

	it('returns 400 when a non-uuid type is passed', async () => {
		const result = await supertest(server)
			.post(cartProducts.route)
			.set('Authorization', `Bearer ${stringFactory()}`);
		expect(result.status).toEqual(400);
	});

	it('returns 401 when no token is passed', async () => {
		const fakeCartProduct = cartProductFactory(fakeCart.id, productId);

		const result = await supertest(server)
			.post(cartProducts.route)
			.send(fakeCartProduct);
		expect(result.status).toEqual(401);
	});

	it('returns 401 when an incorrect token is passed', async () => {
		const incorrectToken = uuidFactory();
		const fakeCartProduct = cartProductFactory(fakeCart.id, productId);
		const result = await supertest(server)
			.post(cartProducts.route)
			.send(fakeCartProduct)
			.set('Authorization', `Bearer ${incorrectToken}`);
		expect(result.status).toEqual(401);
	});

	it('returns 400 when an incorrect product is added to the cart', async () => {
		const incorrectFakeCartProduct = incorrectCartProductFactory(
			fakeCart.id,
			productId
		);

		const result = await supertest(server)
			.post(cartProducts.route)
			.send(incorrectFakeCartProduct)
			.set('Authorization', `Bearer ${fakeSession.token}`);
		expect(result.status).toEqual(400);
	});

	it('returns 200 and adds a product to the cart when it is an existent product', async () => {
		const fakeCartProduct = cartProductFactory(fakeCart.id, productId);

		const result = await supertest(server)
			.post(cartProducts.route)
			.send(fakeCartProduct)
			.set('Authorization', `Bearer ${fakeSession.token}`);
		const registeredProduct = await getCartProduct(productId, fakeCart.id);
		expect(result.status).toEqual(200);
		expect(!!registeredProduct.rowCount).toEqual(true);
		expect(registeredProduct.rows[0]).toHaveProperty('id');
		expect(registeredProduct.rows[0]).toHaveProperty('cart_id');
		expect(registeredProduct.rows[0]).toHaveProperty('products_id');
		expect(registeredProduct.rows[0]).toHaveProperty('product_quantity');
		expect(registeredProduct.rows[0]).toHaveProperty('product_price');
		expect(registeredProduct.rows[0]).toHaveProperty('removed_at');
	});
});
