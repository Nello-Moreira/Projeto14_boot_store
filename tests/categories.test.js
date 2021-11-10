import server from '../src/server.js';
import supertest from 'supertest';
import endConnection from '../src/helpers/endConnection.js';

import {
	insertCategory,
	deleteAllCategories,
} from '../src/data/categoriesTable.js';
import categories from '../src/controllers/categories.js';

import categoryFactory from './factories/categoryFactory.js';

describe('get /categories', () => {
	const fakeCategory = categoryFactory();

	beforeAll(async () => {
		await deleteAllCategories();
		await insertCategory(fakeCategory.name);
	});

	afterEach(async () => {
		await deleteAllCategories();
	});

	afterAll(() => endConnection());

	it('should return status code 200 and an array of categories', async () => {
		const routeReturn = await supertest(server).get(categories.route);

		expect(routeReturn.status).toEqual(200);
		expect(routeReturn.body).toContainEqual(fakeCategory.name);
	});

	it('should return status code 204 when there are no categories', async () => {
		const routeReturn = await supertest(server).get(categories.route);

		expect(routeReturn.status).toEqual(204);
	});
});
