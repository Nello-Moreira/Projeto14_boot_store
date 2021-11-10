import dbConnection from './connection';

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

export { insertSession, deleteAllSessions };
