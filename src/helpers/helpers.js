const productsPerPage = 16;

const getOffset = (page = 1) => productsPerPage * (page - 1);

const internalErrorResponse = (response, error) => {
	console.log(error);
	return response
		.status(500)
		.send('There was an internal error. Please try again later.');
};

export { productsPerPage, getOffset, internalErrorResponse };
