import dbConnection from './connection.js';

const searchSession = (userUuid, token) =>
	dbConnection.query(
		`SELECT 
		users.id, users.name, users.email
		FROM users
		JOIN sessions
			ON sessions.user_id = users.id
		WHERE
			users.uuid  = $1 AND
			sessions.token= $2;`,
		[userUuid, token]
	);

const insertSession = (userId, token) =>
	dbConnection.query(
		`
        INSERT INTO sessions (user_id, token)
        VALUES ($1, $2);
    `,
		[userId, token]
	);

const deleteSession = (id, token) =>
	dbConnection.query(
		`
		DELETE FROM sessions
		WHERE
			user_id = $1 AND
			token = $2
		returning id
		;`,
		[id, token]
	);

const deleteAllSessions = () => dbConnection.query('DELETE FROM sessions;');

function getToken(token) {
	return dbConnection.query(
		'SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token = $1',
		[token]
	);
}

export {
	searchSession,
	insertSession,
	deleteSession,
	deleteAllSessions,
	getToken,
};
