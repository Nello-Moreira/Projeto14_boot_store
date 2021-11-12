import dbConnection from './connection.js';

function insertSession(session) {
	return dbConnection.query(
		`
        INSERT INTO sessions (user_id, token)
        VALUES ($1, $2)
    `,
		[session.user_id, session.token]
	);
}

function deleteAllSessions() {
	return dbConnection.query('DELETE FROM sessions;');
}

function getToken(token) {
	return dbConnection.query(
		'SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token = $1',
		[token]
	);
}

export { insertSession, deleteAllSessions, getToken };
