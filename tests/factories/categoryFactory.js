import faker from 'faker';
faker.locale = 'pt_BR';

export default function categoryFactory() {
	return {
		id: null,
		name: faker.commerce.department(),
	};
}
