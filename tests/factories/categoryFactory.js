import faker from 'faker';
faker.locale = 'pt_BR';

const categoryFactory = () => ({
	name: faker.commerce.department(),
});

export default categoryFactory;
