import faker from 'faker';
faker.locale = 'pt_BR';

function openCartFactory(userId) {
	return {
		id: null,
		uuid: faker.datatype.uuid(),
		user_id: userId,
		payment_date: null,
	};
}

function closedCartFactory(userId) {
	return {
		id: null,
		uuid: faker.datatype.uuid(),
		user_id: userId,
		payment_date: faker.date.soon(),
	};
}

export { openCartFactory, closedCartFactory };
