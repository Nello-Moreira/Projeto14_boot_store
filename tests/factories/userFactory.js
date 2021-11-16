import faker from 'faker';
faker.locale = 'pt_BR';

export default function userFactory() {
	const name = faker.name.firstName();

	return {
		id: null,
		uuid: faker.datatype.uuid(),
		name,
		email: faker.internet.email(name),
		password: faker.datatype.string(),
		avatar_url: faker.image.imageUrl(),
	};
}
