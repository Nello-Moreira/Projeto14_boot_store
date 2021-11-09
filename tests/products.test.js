import supertest from 'supertest';
import server from '../src/server.js';
import endConnection from '../src/helpers/endConnection.js';

import {
	insertCategory,
	deleteAllCategories,
} from '../src/data/categoriesTable.js';
import { insertColor, deleteAllColors } from '../src/data/colorsTable.js';
import { insertProduct, deleteAllProducts } from '../src/data/productsTable.js';

import categoryFactory from './factories/categoryFactory.js';
import colorFactory from './factories/colorFactory.js';
import { productFactory } from './factories/productFactory.js';

afterAll(() => {
	endConnection();
});

describe('get /products', () => {
	const fakeColor = colorFactory();
	const fakeCategory = categoryFactory();

	let fakeProduct;

	beforeAll(async () => {
		await deleteAllProducts();
		await deleteAllCategories();
		await deleteAllColors();

		fakeCategory.id = (await insertCategory(fakeCategory.name)).rows[0].id;
		fakeColor.id = (await insertColor(fakeColor.name)).rows[0].id;
	});

	afterEach(async () => {
		fakeProduct = productFactory(fakeColor.id, fakeCategory.id);
		await insertProduct(fakeProduct);
	});

	afterAll(async () => {
		await deleteAllProducts();
		await deleteAllCategories();
		await deleteAllColors();
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
		expect(result.body.products[0]).toHaveProperty('id');
		expect(result.body.products[0]).toHaveProperty('uuid');
		expect(result.body.products[0]).toHaveProperty('name');
		expect(result.body.products[0]).toHaveProperty('price');
		expect(result.body.products[0]).toHaveProperty('image_url');
	});
});
