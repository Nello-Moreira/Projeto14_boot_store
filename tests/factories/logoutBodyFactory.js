import faker from 'faker';
faker.locale = 'pt_BR';

export default function logoutBodyFactory(user, token) {
	return {
		userId: user.uuid,
		token,
	};
}
