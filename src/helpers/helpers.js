const internalErrorResponse = (response, error) => {
  console.log(error);
  return response
    .status(500)
    .send('There was an internal error. Please try again later.');
};

export { internalErrorResponse };
