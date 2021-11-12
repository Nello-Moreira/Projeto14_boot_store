import faker from 'faker';
faker.locale = 'pt_BR';

export default function sessionFactory(userId) {
	return {
		user_id: userId,
		token: faker.datatype.uuid(),
	};
}
