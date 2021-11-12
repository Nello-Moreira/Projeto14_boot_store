import faker from 'faker';
faker.locale = 'pt_BR';

const productFactory = (colorId, CategoryId) => ({
	uuid: faker.datatype.uuid(),
	name: faker.commerce.productName(),
	description: faker.commerce.productDescription(),
	price: faker.datatype.float(),
	color_id: colorId,
	image_url: faker.image.imageUrl(),
	category_id: CategoryId,
});

export default productFactory;
