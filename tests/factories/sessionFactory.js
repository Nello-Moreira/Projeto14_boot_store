import faker from 'faker';
faker.locale = 'pt_BR';

function sessionFactory(userId) {
	return {
		user_id: userId,
		token: faker.datatype.uuid(),
	};
}

export default sessionFactory;
