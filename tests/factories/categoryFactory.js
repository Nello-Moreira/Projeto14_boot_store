import faker from 'faker';
faker.locale = 'pt_BR';

export default function categoryFactory() {
	return {
		name: faker.commerce.department(),
	};
}
