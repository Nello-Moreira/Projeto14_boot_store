import { v4 as uuid } from 'uuid';
import { internalErrorResponse } from '../helpers/helpers.js';
import { isCorrectPassword } from '../helpers/passwordEncryption.js';
import loginSchema from '../validations/loginValidation.js';

import { searchUserByParam } from '../data/usersTable.js';
import { insertSession } from '../data/sessionsTable.js';

const route = '/login';

const postLogin = async (request, response) => {
	const loginObject = request.body;

	const loginValidationError = loginSchema.validate(loginObject).error;

	if (loginValidationError) {
		return response.status(400).send(loginValidationError.message);
	}

	try {
		const existingUser = await searchUserByParam(
			'email',
			loginObject.email
		);

		if (
			existingUser.rowCount === 0 ||
			!isCorrectPassword(
				loginObject.password,
				existingUser.rows[0].password
			)
		) {
			return response.status(404).send('Incorrect e-mail or password');
		}

		const token = uuid();

		await insertSession(existingUser.rows[0].id, token);

		return response.status(200).send({
			userId: existingUser.rows[0].uuid,
			token,
			name: existingUser.rows[0].name,
			avatarUrl: existingUser.rows[0].avatar_url,
		});
	} catch (error) {
		return internalErrorResponse(response, error);
	}
};

const login = { route, postLogin };

export default login;
