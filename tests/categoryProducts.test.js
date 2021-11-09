import server from '../src/server.js';
import supertest from 'supertest';
import endConnection from '../src/helpers/endConnection.js';

import {
	insertCategory,
	deleteAllCategories,
} from '../src/data/categoriesTable.js';
import { insertColor, deleteAllColors } from '../src/data/colorsTable.js';
import { insertProduct, deleteAllProducts } from '../src/data/productsTable.js';
import categoryProducts from '../src/controllers/categoryProducts.js';

import categoryFactory from './factories/categoryFactory.js';
import colorFactory from './factories/colorFactory.js';
import productFactory from './factories/productFactory.js';

describe('get /category/:name', () => {
	const fakeColor = colorFactory();
	const fakeCategory = categoryFactory();
	const fakeCategory2 = categoryFactory();

	let fakeProduct;
	let fakeProduct2;

	beforeAll(async () => {
		await deleteAllProducts();
		await deleteAllCategories();
		await deleteAllColors();

		fakeCategory.id = (await insertCategory(fakeCategory.name)).rows[0].id;
		fakeCategory2.id = (
			await insertCategory(fakeCategory2.name)
		).rows[0].id;

		fakeColor.id = (await insertColor(fakeColor.name)).rows[0].id;

		fakeProduct = productFactory(fakeColor.id, fakeCategory.id);
		fakeProduct2 = productFactory(fakeColor.id, fakeCategory2.id);

		await insertProduct(fakeProduct);
		await insertProduct(fakeProduct2);
	});

	afterEach(async () => {
		let waiting = await deleteAllProducts();
		waiting = await deleteAllCategories();
		waiting = await deleteAllColors();
	});

	afterAll(() => endConnection());

	it('should return status code 200 and an array of products from a specific category', async () => {
		const expectedReturn = {
			id: fakeProduct.uuid,
			name: fakeProduct.name,
			description: fakeProduct.description,
			price: String(fakeProduct.price),
			color: fakeColor.name,
			image_url: fakeProduct.image_url,
		};

		const routeReturn = await supertest(server).get(
			categoryProducts.route.replace(':name', fakeCategory.name)
		);
		expect(routeReturn.status).toEqual(200);
		expect(routeReturn.body.length).toEqual(1);
		expect(routeReturn.body[0]).toEqual(
			expect.objectContaining(expectedReturn)
		);
	});

	it('should return status code 204 when there are no categories', async () => {
		const routeReturn = await supertest(server).get(
			categoryProducts.route.replace(':name', fakeCategory.name)
		);
		expect(routeReturn.status).toEqual(204);
	});
});
