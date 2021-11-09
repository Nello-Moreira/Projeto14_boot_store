import connection from '../../src/data/connection.js';
import faker from 'faker';
faker.locale = 'pt_BR';

const product = {
	uuid: faker.datatype.uuid(),
	name: faker.name.firstName(),
	description: faker.commerce.productDescription(),
	price: faker.datatype.float(),
	color_id: -1,
	image_url: faker.image.imageUrl(),
	category_id: -1,
};

async function deleteProducts() {
	await connection.query('DELETE FROM products;');
	await connection.query('DELETE FROM categories;');
	await connection.query('DELETE FROM colors;');
}

async function insertProduct() {
	await createColor();
	await createCategory();
	await connection.query(
		`INSERT INTO products 
		(uuid, name, description, price, color_id, image_url, category_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7);`,
		[
			product.uuid,
			product.name,
			product.description,
			product.price,
			product.color_id,
			product.image_url,
			product.category_id,
		]
	);
}

async function createColor() {
	const result = await connection.query(
		`INSERT INTO colors (name) VALUES ('${faker.commerce.color()}') RETURNING id;`
	);
	product.color_id = Number(result.rows[0].id);
}

async function createCategory() {
	const result = await connection.query(
		`INSERT INTO categories (name) VALUES ('${faker.commerce.department()}') RETURNING id;`
	);
	product.category_id = Number(result.rows[0].id);
}

export { deleteProducts, insertProduct };