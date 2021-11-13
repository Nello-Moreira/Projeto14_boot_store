import server from '../src/server.js';
import supertest from 'supertest';
import endConnection from '../src/helpers/endConnection.js';
import login from '../src/controllers/login.js';

import {
	searchSession,
	insertSession,
	deleteAllSessions,
} from '../src/data/sessionsTable.js';
import { insertUser, deleteAllUsers } from '../src/data/usersTable.js';

import userFactory from './factories/userFactory.js';
import uuidFactory from './factories/uuidFactory.js';
import {
	loginBodyFactory,
	invalidLoginEmailFactory,
	wrongLoginPasswordFactory,
} from './factories/loginBodyFactory.js';

import { hashPassword } from '../src/helpers/passwordEncryption.js';

describe('post /login', () => {
	const user = userFactory();
	const user2 = userFactory();
	const token = uuidFactory();
	const validBody = loginBodyFactory(user);
	const secondValidBody = loginBodyFactory(user2);
	const invalidBody = invalidLoginEmailFactory();
	const wrongPasswordBody = wrongLoginPasswordFactory(validBody);

	beforeAll(async () => {
		await deleteAllSessions();
		await deleteAllUsers();

		const userId = (
			await insertUser({ ...user, password: hashPassword(user.password) })
		).rows[0].id;
		await insertSession(userId, token);
	});

	afterAll(async () => {
		await deleteAllSessions();
		await deleteAllUsers();
		endConnection();
	});

	it('should return status code 404 when there is no such email', async () => {
		const routeReturn = await supertest(server)
			.post(login.route)
			.send(secondValidBody);

		expect(routeReturn.status).toEqual(404);
	});

	it('should return status code 404 when the password is incorrect', async () => {
		const routeReturn = await supertest(server)
			.post(login.route)
			.send(wrongPasswordBody);

		expect(routeReturn.status).toEqual(404);
	});

	it('should return status code 400 when email is invalid', async () => {
		const routeReturn = await supertest(server)
			.post(login.route)
			.send(invalidBody);

		expect(routeReturn.status).toEqual(400);
	});

	it('should return status code 200 when email is valid and password is correct', async () => {
		const routeReturn = await supertest(server)
			.post(login.route)
			.send(validBody);

		const successfulLogin = await searchSession(
			user.uuid,
			routeReturn.body.token
		);

		expect(routeReturn.status).toEqual(200);
		expect(successfulLogin.rowCount).toEqual(1);
	});
});
