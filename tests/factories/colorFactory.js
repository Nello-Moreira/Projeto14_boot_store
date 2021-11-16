import faker from 'faker';
faker.locale = 'pt_BR';

export default function colorFactory() {
	return {
		id: null,
		name: faker.commerce.color(),
	};
}
