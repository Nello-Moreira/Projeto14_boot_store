import { internalErrorResponse } from '../helpers/helpers.js';
import {
	hashPassword,
	comparePassword,
} from '../helpers/passwordEncryption.js';
import signUpSchema from '../validations/signUpValidation.js';

const route = '/sign-up';

const postSignUp = async (request, response) => {
	const signUpObject = request.body;

	const signUpValidationError = signUpSchema.validate(signUpObject).error;

	if (signUpValidationError) {
		return response.status(400).send(signUpValidationError.message);
	}

	try {
		return response.sendStatus(200);
	} catch (error) {
		return internalErrorResponse(response, error);
	}
};

const signUp = { route, postSignUp };

export default signUp;
