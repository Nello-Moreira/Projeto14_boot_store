import faker from 'faker';
faker.locale = 'pt_BR';

function userFactory() {
	return {
		uuid: faker.datatype.uuid(),
		name: faker.name.findName(),
		email: faker.internet.email(),
		password: faker.datatype.string(),
		avatar_url: faker.image.imageUrl(),
	};
}

export default userFactory;
