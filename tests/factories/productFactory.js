import faker from 'faker';
faker.locale = 'pt_BR';

export default function productFactory(colorId, CategoryId) {
	return {
		uuid: faker.datatype.uuid(),
		name: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		price: faker.datatype.float(),
		color_id: colorId,
		image_url: faker.image.imageUrl(),
		category_id: CategoryId,
	};
}
