import faker from 'faker';
faker.locale = 'pt_BR';

export default function colorFactory() {
	return {
		name: faker.commerce.color(),
	};
}
