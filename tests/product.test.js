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
import {
	productFactory,
	uuidFactory,
	stringFactory,
} from './factories/productFactory.js';

afterAll(() => {
	endConnection();
});

describe('get /products/:id', () => {
	const fakeColor = colorFactory();
	const fakeCategory = categoryFactory();
	let fakeProduct;

	let existentUuid;
	let fakeUuid;
	let nonUuid;

	beforeAll(async () => {
		await deleteAllProducts();
		await deleteAllCategories();
		await deleteAllColors();

		fakeUuid = uuidFactory();
		nonUuid = stringFactory();
		fakeCategory.id = (await insertCategory(fakeCategory.name)).rows[0].id;
		fakeColor.id = (await insertColor(fakeColor.name)).rows[0].id;
	});

	afterEach(async () => {
		fakeProduct = productFactory(fakeColor.id, fakeCategory.id);
		existentUuid = await insertProduct(fakeProduct);
	});

	afterAll(async () => {
		await deleteAllProducts();
		await deleteAllCategories();
		await deleteAllColors();
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

	it('returns 400 when a non-uuid type is passed', async () => {
		const result = await supertest(server).get(`/products/${nonUuid}`);
		expect(result.status).toEqual(400);
	});
});
