import faker from 'faker';
faker.locale = 'pt_BR';

const productFactory = (colorId, CategoryId) => ({
	uuid: faker.datatype.uuid(),
	name: faker.name.firstName(),
	description: faker.commerce.productDescription(),
	price: faker.datatype.float(),
	color_id: colorId,
	image_url: faker.image.imageUrl(),
	category_id: CategoryId,
});

function uuidFactory() {
	return faker.datatype.uuid();
}

function stringFactory() {
	const string = faker.datatype.string();
	const letters = string.match(/([A-z])/g);
	return letters.join('');
}

export { productFactory, uuidFactory, stringFactory };
