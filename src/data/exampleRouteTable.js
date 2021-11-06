import dbConnection from './connection.js';

const searchAllExamples = () => dbConnection.query(`SELECT * FROM examples`);

export { searchAllExamples };
