import server from '../src/server.js';
import supertest from 'supertest';
import endConnection from '../src/helpers/endConnection.js';
import { productsPerPage } from '../src/helpers/helpers.js';

import {
	insertCategory,
	deleteAllCategories,
} from '../src/data/categoriesTable.js';
import { insertColor, deleteAllColors } from '../src/data/colorsTable.js';
import { insertProduct, deleteAllProducts } from '../src/data/productsTable.js';
import categoryProducts from '../src/controllers/categoryProducts.js';

import colorFactory from './factories/colorFactory.js';
import productFactory from './factories/productFactory.js';
import stringFactory from './factories/stringFactory';

describe('get /category/:name', () => {
	const fakeColor = colorFactory();
	const fakeCategory = { name: stringFactory() };
	const fakeCategory2 = { name: stringFactory() };
	const fakeCategory3 = { name: stringFactory() };

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
	});

	afterEach(async () => {
		await deleteAllProducts();

		for (let i = 0; i <= productsPerPage; i++) {
			await insertProduct(fakeProduct);
		}

		await insertProduct(fakeProduct2);
	});

	afterAll(async () => {
		await deleteAllProducts();
		await deleteAllCategories();
		await deleteAllColors();
		endConnection();
	});

	it('should return status code 204 when there are no products', async () => {
		const routeReturn = await supertest(server).get(
			categoryProducts.route.replace(':name', fakeCategory.name)
		);
		expect(routeReturn.status).toEqual(204);
	});

	it("should return status code 404 when the requested category doesn't exist", async () => {
		const routeReturn = await supertest(server).get(
			categoryProducts.route.replace(':name', fakeCategory3.name)
		);

		expect(routeReturn.status).toEqual(404);
	});

	it('should return status code 200 and an array of products from a specific page number', async () => {
		const expectedReturn = {
			id: fakeProduct.uuid,
			name: fakeProduct.name,
			description: fakeProduct.description,
			price: fakeProduct.price.toFixed(2),
			color: fakeColor.name,
			image_url: fakeProduct.image_url,
		};

		const routeReturn = await supertest(server).get(
			categoryProducts.route.replace(
				':name',
				`${fakeCategory.name}?page=2`
			)
		);

		expect(routeReturn.status).toEqual(200);
		expect(routeReturn.body.pagesCount).toEqual(2);
		expect(routeReturn.body.products.length).toEqual(1);
		expect(routeReturn.body.products[0]).toEqual(expectedReturn);
	});

	it('should return status code 200 and an array of products from a specific category', async () => {
		const expectedReturn = {
			id: fakeProduct.uuid,
			name: fakeProduct.name,
			description: fakeProduct.description,
			price: fakeProduct.price.toFixed(2),
			color: fakeColor.name,
			image_url: fakeProduct.image_url,
		};

		const routeReturn = await supertest(server).get(
			categoryProducts.route.replace(':name', fakeCategory.name)
		);

		expect(routeReturn.status).toEqual(200);
		expect(routeReturn.body.pagesCount).toEqual(2);
		expect(routeReturn.body.products.length).toEqual(productsPerPage);
		expect(routeReturn.body.products[0]).toEqual(expectedReturn);
	});

	it('should return status code 400 when the page parameter is invalid', async () => {
		const routeReturn = await supertest(server).get(
			categoryProducts.route.replace(
				':name',
				`${fakeCategory.name}?page=${stringFactory()}`
			)
		);

		expect(routeReturn.status).toEqual(400);
	});
});
