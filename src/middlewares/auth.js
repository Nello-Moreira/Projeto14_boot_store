import validateUuid from '../validations/uuidValidation.js';
import { getToken } from '../data/sessionsTable.js';
import { internalErrorResponse } from '../helpers/helpers.js';

export default async function auth(req, res) {
	const token = req.headers.authorization?.replace('Bearer ', '');
	const tokenValidation = validateUuid(token);
	if (tokenValidation.error) {
		return { statusCode: 400 };
	}

	try {
		if (!token) {
			return { statusCode: 401 };
		}
		const result = await getToken(token);
		if (!result.rowCount) {
			return { statusCode: 401 };
		}
		return { result };
	} catch (error) {
		return internalErrorResponse(res, error);
	}
}
