import supertest from 'supertest';
import server from '../src/server.js';
import endConnection from '../src/helpers/endConnection.js';
import cart from '../src/controllers/cart.js';

import { insertUser, deleteAllUsers } from '../src/data/usersTable.js';
import { insertSession, deleteAllSessions } from '../src/data/sessionsTable.js';
import { insertCart, getCart, deleteAllCarts } from '../src/data/cartsTable.js';

import stringFactory from './factories/stringFactory.js';
import uuidFactory from './factories/uuidFactory.js';
import userFactory from './factories/userFactory.js';
import sessionFactory from './factories/sessionFactory.js';
import { openCartFactory, closedCartFactory } from './factories/cartFactory.js';

afterAll(() => {
	endConnection();
});

describe('post /cart', () => {
	const fakeUser = userFactory();
	let fakeSession;

	beforeAll(async () => {
		await deleteAllUsers();
		await deleteAllSessions();
		await deleteAllCarts();
		fakeUser.id = (await insertUser(fakeUser)).rows[0].id;
		fakeSession = sessionFactory(fakeUser.id);
		await insertSession(fakeSession);
	});

	afterAll(async () => {
		await deleteAllSessions();
		await deleteAllCarts();
		await deleteAllUsers();
	});

	it('returns 400 when a non-uuid type is passed', async () => {
		const result = await supertest(server)
			.post(cart.route)
			.set('Authorization', `Bearer ${stringFactory()}`);
		expect(result.status).toEqual(400);
	});

	it('returns 401 when no token is passed', async () => {
		const result = await supertest(server).post(cart.route);
		expect(result.status).toEqual(401);
	});

	it('returns 401 when an incorrect token is passed', async () => {
		const incorrectToken = uuidFactory();
		const result = await supertest(server)
			.post(cart.route)
			.set('Authorization', `Bearer ${incorrectToken}`);
		expect(result.status).toEqual(401);
	});

	it('returns 200 and an id when a cart is created correctly', async () => {
		const result = await supertest(server)
			.post(cart.route)
			.set('Authorization', `Bearer ${fakeSession.token}`);
		expect(result.status).toEqual(200);
		expect(result.body).toHaveProperty('id');

		const cartDb = await getCart(fakeUser.id);
		expect(cartDb.rowCount).toEqual(1);
	});
});

describe('get /cart', () => {
	const fakeUser = userFactory();
	let fakeSession;
	let fakeCart;

	beforeAll(async () => {
		await deleteAllSessions();
		await deleteAllCarts();
		await deleteAllUsers();
		fakeUser.id = (await insertUser(fakeUser)).rows[0].id;
		fakeSession = sessionFactory(fakeUser.id);
		fakeCart = openCartFactory(fakeUser.id);

		await insertSession(fakeSession);
		await insertCart(fakeCart);
	});

	afterEach(async () => {
		await deleteAllCarts();

		fakeCart = closedCartFactory(fakeUser.id);
		await insertCart(fakeCart);
	});

	it('returns 200 and an open cart when there is an open cart', async () => {
		const result = await supertest(server)
			.get(cart.route)
			.set('Authorization', `Bearer ${fakeSession.token}`);
		expect(result.status).toEqual(200);
		expect(result.body).toHaveProperty('id');
		expect(result.body).toHaveProperty('uuid');
		expect(result.body).toHaveProperty('user_id');
		expect(result.body).toHaveProperty('payment_date');
		expect(result.body.payment_date).toEqual(null);
	});

	it('returns 200 and an empty array when there are no open carts', async () => {
		const result = await supertest(server)
			.get(cart.route)
			.set('Authorization', `Bearer ${fakeSession.token}`);
		expect(result.status).toEqual(200);
		expect(result.body).toEqual([]);
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
