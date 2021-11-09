import supertest from 'supertest';
import server from '../src/server.js';
import { deleteProducts, insertProduct } from './factories/productsFactory.js';
import endConnection from '../src/helpers/endConnection.js';

afterAll(() => {
	endConnection();
});

describe('get /products', () => {
	beforeAll(async () => {
		await deleteProducts();
	});

	afterEach(async () => {
		await insertProduct();
		await insertProduct();
	});

	afterAll(async () => {
		await deleteProducts();
	});

	it('returns 200 and an empty array when there are no products', async () => {
		const result = await supertest(server).get('/products');
		expect(result.status).toEqual(200);
		expect(result.body).toEqual([]);
	});

	it('returns 200 and a product array when there are products', async () => {
		const result = await supertest(server).get('/products');
		expect(result.status).toEqual(200);
		expect(result.body).toHaveProperty('count');
		expect(result.body.products[0]).toHaveProperty('uuid');
		expect(result.body.products[0]).toHaveProperty('name');
		expect(result.body.products[0]).toHaveProperty('price');
		expect(result.body.products[0]).toHaveProperty('image_url');
	});
});
