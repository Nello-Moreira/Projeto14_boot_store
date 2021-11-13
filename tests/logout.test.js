import server from '../src/server.js';
import supertest from 'supertest';
import endConnection from '../src/helpers/endConnection.js';
import logout from '../src/controllers/logout.js';

import {
	searchSession,
	insertSession,
	deleteAllSessions,
} from '../src/data/sessionsTable.js';
import { insertUser, deleteAllUsers } from '../src/data/usersTable.js';

import userFactory from './factories/userFactory.js';
import uuidFactory from './factories/uuidFactory.js';
import logoutBodyFactory from './factories/logoutBodyFactory.js';

import { hashPassword } from '../src/helpers/passwordEncryption.js';

describe('post /logout', () => {
	const user = userFactory();
	const token = uuidFactory();
	const validBody = logoutBodyFactory(user, token);

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

	it('should return status code 200 when email is valid and password is correct', async () => {
		const routeReturn = await supertest(server)
			.post(logout.route)
			.send(validBody);

		const successfulLogout = await searchSession(user.uuid, token);

		expect(routeReturn.status).toEqual(200);
		expect(successfulLogout.rowCount).toEqual(0);
	});

	it("should return status code 404 when the session doesn't exist", async () => {
		const routeReturn = await supertest(server)
			.post(logout.route)
			.send(validBody);

		expect(routeReturn.status).toEqual(404);
	});
});
