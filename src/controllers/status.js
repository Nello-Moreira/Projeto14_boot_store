const route = '/status';

const getStatus = (request, response) => response.sendStatus(200);

const status = { route, getStatus };

export default status;
