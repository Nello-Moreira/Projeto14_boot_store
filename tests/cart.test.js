import supertest from 'supertest';
import server from '../src/server.js';
import endConnection from '../src/helpers/endConnection.js';
import cart from '../src/controllers/cart.js';

import { insertUser, deleteAllUsers } from '../src/data/usersTable.js';
import { insertSession, deleteAllSessions } from '../src/data/sessionsTable.js';
import { getCart } from '../src/data/cartsTable.js';

import stringFactory from './factories/stringFactory.js';
import uuidFactory from './factories/uuidFactory.js';
import userFactory from './factories/userFactory.js';
import sessionFactory from './factories/sessionFactory.js';

afterAll(() => {
	endConnection();
});

describe('post /cart', () => {
	const fakeUser = userFactory();
	let fakeSession;

	beforeAll(async () => {
		await deleteAllUsers();
		await deleteAllSessions();
		fakeUser.id = (await insertUser(fakeUser)).rows[0].id;
		fakeSession = sessionFactory(fakeUser.id);
		await insertSession(fakeSession);
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
