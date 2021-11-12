import faker from 'faker';
faker.locale = 'pt_BR';

export default function openCartFactory(userId) {
	return {
		uuid: faker.datatype.uuid(),
		user_id: userId,
		payment_date: null,
	};
}
