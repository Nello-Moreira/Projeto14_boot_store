import supertest from 'supertest';
import server from '../src/server.js';
import {
	deleteProducts,
	insertProduct,
	generateUuid,
	generateString,
} from './factories/productsFactory.js';
import endConnection from '../src/helpers/endConnection.js';

afterAll(() => {
	endConnection();
});

describe('get /products/:id', () => {
	let existentUuid;
	let fakeUuid;
	let nonUuid;

	beforeAll(async () => {
		await deleteProducts();
		fakeUuid = generateUuid();
		nonUuid = generateString();
	});

	afterEach(async () => {
		existentUuid = await insertProduct();
	});

	afterAll(async () => {
		await deleteProducts();
	});

	it('returns 404 when a non-existent uuid is passed', async () => {
		const result = await supertest(server).get(`/products/${fakeUuid}`);
		expect(result.status).toEqual(404);
	});

	it('returns 200 and a product when a correct uuid is passed', async () => {
		const result = await supertest(server).get(`/products/${existentUuid}`);
		expect(result.status).toEqual(200);
		expect(result.body).toHaveProperty('id');
		expect(result.body).toHaveProperty('uuid');
		expect(result.body).toHaveProperty('name');
		expect(result.body).toHaveProperty('description');
		expect(result.body).toHaveProperty('price');
		expect(result.body).toHaveProperty('color_id');
		expect(result.body).toHaveProperty('image_url');
		expect(result.body).toHaveProperty('category_id');
	});

	it('returns 500 when a non-uuid type is passed', async () => {
		const result = await supertest(server).get(`/products/${nonUuid}`);
		expect(result.status).toEqual(500);
	});
});
