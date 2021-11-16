import supertest from 'supertest';
import server from '../src/server.js';
import endConnection from '../src/helpers/endConnection.js';
import checkout from '../src/controllers/checkout.js';

import {
	insertProduct,
	deleteAllProducts,
	getProductIdByUuid,
} from '../src/data/productsTable.js';
import { deleteAllCarts } from '../src/data/cartsTable.js';
import { deleteAllCartProducts } from '../src/data/cartsProductsTable.js';
import {
	deleteAllCategories,
	insertCategory,
} from '../src/data/categoriesTable.js';
import { deleteAllColors, insertColor } from '../src/data/colorsTable.js';
import { insertUser, deleteAllUsers } from '../src/data/usersTable.js';
import { insertSession, deleteAllSessions } from '../src/data/sessionsTable.js';
import { insertCart, getCart } from '../src/data/cartsTable.js';

import categoryFactory from './factories/categoryFactory.js';
import colorFactory from './factories/colorFactory.js';
import productFactory from './factories/productFactory.js';
import uuidFactory from './factories/uuidFactory.js';
import stringFactory from './factories/stringFactory.js';
import userFactory from './factories/userFactory.js';
import sessionFactory from './factories/sessionFactory.js';
import { openCartFactory } from './factories/cartFactory.js';

const fakeColor = colorFactory();
const fakeCategory = categoryFactory();
const fakeUser = userFactory();
let fakeProduct;
let fakeSession;
let fakeCart;

afterAll(() => {
	endConnection();
});

describe('post /checkout', () => {
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

		await insertProduct(fakeProduct);
		await insertSession(fakeSession.user_id, fakeSession.token);

		fakeProduct.id = (
			await getProductIdByUuid(fakeProduct.uuid)
		).rows[0].id;
	});

	afterEach(async () => {
		fakeCart = openCartFactory(fakeUser.id);
		await insertCart(fakeCart);
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

	it(`returns 404 when a token is sent for a user that doesn't have an open cart`, async () => {
		const result = await supertest(server)
			.post(checkout.route)
			.set('Authorization', `Bearer ${fakeSession.token}`);
		expect(result.status).toEqual(404);
	});

	it('returns 200 and closes the cart for a user with an open cart', async () => {
		const result = await supertest(server)
			.post(checkout.route)
			.set('Authorization', `Bearer ${fakeSession.token}`);
		expect(result.status).toEqual(200);

		const cart = await getCart(fakeUser.id);
		expect(cart.rows[0].payment_date).not.toEqual(null);
	});

	it('returns 400 when a non-uuid type is passed', async () => {
		const result = await supertest(server)
			.post(checkout.route)
			.set('Authorization', `Bearer ${stringFactory()}`);
		expect(result.status).toEqual(400);
	});

	it('returns 401 when no token is passed', async () => {
		const result = await supertest(server).post(checkout.route);
		expect(result.status).toEqual(401);
	});

	it('returns 401 when an incorrect token is passed', async () => {
		const incorrectToken = uuidFactory();
		const result = await supertest(server)
			.post(checkout.route)
			.set('Authorization', `Bearer ${incorrectToken}`);
		expect(result.status).toEqual(401);
	});
});
