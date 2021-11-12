import faker from 'faker';
faker.locale = 'pt_BR';

function openCartFactory(userId) {
	return {
		uuid: faker.datatype.uuid(),
		user_id: userId,
		payment_date: null,
	};
}

function closedCartFactory(userId) {
	return {
		uuid: faker.datatype.uuid(),
		user_id: userId,
		payment_date: faker.date.recent(),
	};
}

export { openCartFactory, closedCartFactory };
