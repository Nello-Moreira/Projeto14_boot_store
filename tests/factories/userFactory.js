import faker from 'faker';
faker.locale = 'pt_BR';

export default function userFactory() {
	return {
		uuid: faker.datatype.uuid(),
		name: faker.name.findName(),
		email: faker.internet.email(),
		password: faker.datatype.string(),
		avatar_url: faker.image.imageUrl(),
	};
}
