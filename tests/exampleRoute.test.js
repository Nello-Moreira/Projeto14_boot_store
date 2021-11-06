import server from '../src/server.js';
import supertest from 'supertest';
import dbConnection from '../src/data/connection.js';
import exampleRoute from '../src/controllers/exampleRoute.js';

const someTest = async () => {
  const response = await supertest(server).get(exampleRoute.route);
  expect(response.status).toBe(200);
};

const routeTests = () => {
  beforeAll(() => {
    dbConnection.query('DELETE FROM examples');
  });

  it('should return something', someTest);
};

describe('Tests for route', routeTests);
