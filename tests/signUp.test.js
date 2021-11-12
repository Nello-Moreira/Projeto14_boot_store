import server from '../src/server.js';
import supertest from 'supertest';
import endConnection from '../src/helpers/endConnection.js';
import signUp from '../src/controllers/signUp.js';

import {
	searchUserByParam,
	deleteAllUsers,
	insertUser,
} from '../src/data/usersTable.js';

import {
	validSignUpBodyFactory,
	invalidSignUpBodyFactory,
} from './factories/signUpBodyFactory.js';
import uuidFactory from './factories/uuidFactory.js';

describe('post /sign-up', () => {
	const validSignUpBody = validSignUpBodyFactory();
	const invalidBody = invalidSignUpBodyFactory();

	beforeAll(async () => {
		await deleteAllUsers();
	});

	afterEach(async () => {
		await deleteAllUsers();
		await insertUser({ ...validSignUpBody, uuid: uuidFactory() });
	});

	afterAll(async () => {
		deleteAllUsers();
		endConnection();
	});

	it('should return status code 200 when an valid body is provided', async () => {
		const routeReturn = await supertest(server)
			.post(signUp.route)
			.send(validSignUpBody);

		const insertedValue = await searchUserByParam(
			'email',
			validSignUpBody.email
		);

		expect(routeReturn.status).toEqual(200);
		expect(insertedValue.rowCount).toEqual(1);
	});

	it('should return status code 409 when provided email is already in use', async () => {
		const routeReturn = await supertest(server)
			.post(signUp.route)
			.send(validSignUpBody);
		expect(routeReturn.status).toEqual(409);
	});

	it('should return status code 400 when an invalid body is provided', async () => {
		const routeReturn = await supertest(server)
			.post(signUp.route)
			.send(invalidBody);
		expect(routeReturn.status).toEqual(400);
	});
});
