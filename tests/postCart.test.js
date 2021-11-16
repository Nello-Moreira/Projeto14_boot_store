import supertest from 'supertest';
import server from '../src/server.js';
import endConnection from '../src/helpers/endConnection.js';
import cart from '../src/controllers/cart.js';

import {
	insertProduct,
	deleteAllProducts,
	getProductIdByUuid,
} from '../src/data/productsTable.js';
import { deleteAllCarts } from '../src/data/cartsTable.js';
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
import userFactory from './factories/userFactory.js';
import sessionFactory from './factories/sessionFactory.js';

const fakeColor = colorFactory();
const fakeCategory = categoryFactory();
const fakeUser = userFactory();
let fakeProduct;
let fakeSession;

afterAll(() => {
	endConnection();
});

describe('post /cart', () => {
	let body;
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
		body = { uuid: fakeProduct.uuid };

		await insertProduct(fakeProduct);
		await insertSession(fakeSession.user_id, fakeSession.token);

		fakeProduct.id = (
			await getProductIdByUuid(fakeProduct.uuid)
		).rows[0].id;
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
			.post(cart.route)
			.send(body)
			.set('Authorization', `Bearer ${stringFactory()}`);
		expect(result.status).toEqual(400);
	});

	it('returns 401 when no token is passed', async () => {
		const result = await supertest(server).post(cart.route).send(body);
		expect(result.status).toEqual(401);
	});

	it('returns 401 when an incorrect token is passed', async () => {
		const incorrectToken = uuidFactory();
		const result = await supertest(server)
			.post(cart.route)
			.send(body)
			.set('Authorization', `Bearer ${incorrectToken}`);
		expect(result.status).toEqual(401);
	});

	it('returns 400 when a non-uuid is sent in the body', async () => {
		const result = await supertest(server)
			.post(cart.route)
			.send({ uuid: stringFactory() })
			.set('Authorization', `Bearer ${fakeSession.token}`);
		expect(result.status).toEqual(400);
	});

	it('returns 404 when a non-existent uuid is sent in the body', async () => {
		const result = await supertest(server)
			.post(cart.route)
			.send({ uuid: uuidFactory() })
			.set('Authorization', `Bearer ${fakeSession.token}`);
		expect(result.status).toEqual(404);
	});

	it('returns 200 when a correct product is sent in the body', async () => {
		const result = await supertest(server)
			.post(cart.route)
			.send(body)
			.set('Authorization', `Bearer ${fakeSession.token}`);
		expect(result.status).toEqual(200);

		const cartProductResult = await getCartProduct(fakeProduct.id);
		expect(cartProductResult.rowCount).toEqual(1);
		expect(cartProductResult.rows[0].products_id).toEqual(fakeProduct.id);
	});

	it('returns 200 when an already added product is sent', async () => {
		const result = await supertest(server)
			.post(cart.route)
			.send(body)
			.set('Authorization', `Bearer ${fakeSession.token}`);
		expect(result.status).toEqual(200);

		const cartProductResult = await getCartProduct(fakeProduct.id);
		expect(cartProductResult.rowCount).toEqual(1);
		expect(cartProductResult.rows[0].products_id).toEqual(fakeProduct.id);
	});
});
