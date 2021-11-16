import supertest from 'supertest';
import server from '../src/server.js';
import endConnection from '../src/helpers/endConnection.js';
import cart from '../src/controllers/cart.js';

import {
	insertProduct,
	deleteAllProducts,
	getProductIdByUuid,
} from '../src/data/productsTable.js';
import { insertCart, deleteAllCarts } from '../src/data/cartsTable.js';
import {
	deleteAllCartProducts,
	insertCartProduct,
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
import userFactory from './factories/userFactory.js';
import sessionFactory from './factories/sessionFactory.js';
import { openCartFactory, closedCartFactory } from './factories/cartFactory.js';
import { cartProductFactory } from './factories/cartProductFactory.js';

const fakeColor = colorFactory();
const fakeCategory = categoryFactory();
const fakeUser = userFactory();
let fakeProduct;
let fakeSession;

afterAll(() => {
	endConnection();
});

describe('get /cart', () => {
	let openCart;
	let closedCart;
	let cartProduct;

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
		openCart = openCartFactory(fakeUser.id);
		closedCart = closedCartFactory(fakeUser.id);

		await insertProduct(fakeProduct);
		await insertSession(fakeSession.user_id, fakeSession.token);
		await insertCart(closedCart);

		fakeProduct.id = (
			await getProductIdByUuid(fakeProduct.uuid)
		).rows[0].id;
	});

	afterEach(async () => {
		const cartId = (await insertCart(openCart)).rows[0].id;
		cartProduct = cartProductFactory(cartId, fakeProduct.id);
		await insertCartProduct(cartProduct);
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

	it('returns 200 and an empty array when there are no open carts', async () => {
		const result = await supertest(server)
			.get(cart.route)
			.set('Authorization', `Bearer ${fakeSession.token}`);
		expect(result.status).toEqual(200);
		expect(result.body).toEqual([]);
	});

	it('returns 200 and an array of products when there are open carts', async () => {
		const result = await supertest(server)
			.get(cart.route)
			.set('Authorization', `Bearer ${fakeSession.token}`);
		expect(result.status).toEqual(200);
		expect(result.body[0]).toHaveProperty('real_id');
		expect(result.body[0]).toHaveProperty('id');
		expect(result.body[0]).toHaveProperty('name');
		expect(result.body[0]).toHaveProperty('price');
		expect(result.body[0]).toHaveProperty('image_url');
		expect(result.body[0]).toHaveProperty('productQuantity');
	});

	it('returns 400 when a non-uuid type is passed', async () => {
		const result = await supertest(server)
			.get(cart.route)
			.set('Authorization', `Bearer ${stringFactory()}`);
		expect(result.status).toEqual(400);
	});

	it('returns 401 when no token is passed', async () => {
		const result = await supertest(server).get(cart.route);
		expect(result.status).toEqual(401);
	});

	it('returns 401 when an incorrect token is passed', async () => {
		const incorrectToken = uuidFactory();
		const result = await supertest(server)
			.get(cart.route)
			.set('Authorization', `Bearer ${incorrectToken}`);
		expect(result.status).toEqual(401);
	});
});
