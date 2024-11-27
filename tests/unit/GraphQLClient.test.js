// tests/unit/GraphQLClient.test.js
const GraphQLClient = require('../../GraphQLClient');
require('dotenv').config();

let client;

beforeAll(() => {
  const endpoint = process.env.GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';
  const authToken = process.env.AUTH_TOKEN || 'your-auth-token';
  client = new GraphQLClient(endpoint, authToken);
});

test('should execute a query with variables', async () => {
  const query = `query GetProduct($id: ID!) { getProduct(id: $id) { id name price stock } }`;
  const variables = { id: '1' };
  const data = await client.executeQuery(query, variables);
  expect(data.getProduct).toBeDefined();
  expect(data.getProduct.id).toBe('1');
});
