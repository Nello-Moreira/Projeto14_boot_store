import { v4 as uuid } from 'uuid';
import { internalErrorResponse } from '../helpers/helpers.js';
import { hashPassword } from '../helpers/passwordEncryption.js';
import signUpSchema from '../validations/signUpValidation.js';

import { searchUserByParam, insertUser } from '../data/usersTable.js';

const route = '/sign-up';

const postSignUp = async (request, response) => {
	const signUpObject = request.body;

	const signUpValidationError = signUpSchema.validate(signUpObject).error;

	if (signUpValidationError) {
		return response.status(400).send(signUpValidationError.message);
	}

	signUpObject.avatarUrl = signUpObject.avatarUrl || null;

	signUpObject.password = hashPassword(signUpObject.password);
	signUpObject.uuid = uuid();

	try {
		const existingUser = await searchUserByParam(
			'email',
			signUpObject.email
		);

		if (existingUser.rowCount === 1) {
			return response.status(409).send('This email is already in use');
		}

		await insertUser(signUpObject);

		return response.sendStatus(200);
	} catch (error) {
		return internalErrorResponse(response, error);
	}
};

const signUp = { route, postSignUp };

export default signUp;
