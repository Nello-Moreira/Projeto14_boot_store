import { internalErrorResponse } from '../helpers/helpers.js';
import sessionSchema from '../validations/sessionValidation.js';

import { searchSession, deleteSession } from '../data/sessionsTable.js';

const route = '/logout';

const postLogout = async (request, response) => {
	const logoutObject = request.body;

	const logoutValidationError = sessionSchema.validate(logoutObject).error;

	if (logoutValidationError) {
		return response.status(400).send(logoutValidationError.message);
	}

	try {
		const existingSession = await searchSession(
			logoutObject.userId,
			logoutObject.token
		);

		if (existingSession.rowCount === 0) {
			return response.sendStatus(404);
		}

		const user = existingSession.rows[0];

		await deleteSession(user.id, logoutObject.token);

		return response.sendStatus(200);
	} catch (error) {
		return internalErrorResponse(response, error);
	}
};

const logout = { route, postLogout };

export default logout;
