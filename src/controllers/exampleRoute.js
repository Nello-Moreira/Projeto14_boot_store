import { internalErrorResponse } from '../helpers/helpers.js';
const route = '/example-route';
async function getRoute(request, response) {
  try {
    response.status(200).send('this is an example route');
  } catch (error) {
    internalErrorResponse(response, error);
  }
}
const exampleRoute = { route, getRoute };
export default exampleRoute;
