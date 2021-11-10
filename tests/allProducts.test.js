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
import productFactory from './factories/productFactory.js';

describe('get /products', () => {
	const fakeColor = colorFactory();
	const fakeCategory = categoryFactory();

	let fakeProduct;
	let fakeProduct2;

	beforeAll(async () => {
		await deleteAllProducts();
		await deleteAllCategories();
		await deleteAllColors();

		fakeCategory.id = (await insertCategory(fakeCategory.name)).rows[0].id;
		fakeColor.id = (await insertColor(fakeColor.name)).rows[0].id;

		fakeProduct = productFactory(fakeColor.id, fakeCategory.id);
		fakeProduct2 = productFactory(fakeColor.id, fakeCategory.id);

		await insertProduct(fakeProduct);
		await insertProduct(fakeProduct2);
	});

	afterEach(async () => {
		await deleteAllProducts();
		await deleteAllCategories();
		await deleteAllColors();
	});

	afterAll(async () => {
		endConnection();
	});

	it('returns 200 and a product array when there are products', async () => {
		const result = await supertest(server).get('/products');
		expect(result.status).toEqual(200);
		expect(result.body).toHaveProperty('pagesCount');
		expect(result.body.products.length).toEqual(2);
		expect(result.body.products[0]).toHaveProperty('id');
		expect(result.body.products[0]).toHaveProperty('name');
		expect(result.body.products[0]).toHaveProperty('price');
		expect(result.body.products[0]).toHaveProperty('image_url');
	});

	it('returns 200 and an empty array when there are no products', async () => {
		const result = await supertest(server).get('/products');
		expect(result.status).toEqual(200);
		expect(result.body).toEqual([]);
	});
});
