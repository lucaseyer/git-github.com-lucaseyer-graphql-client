// const { startServer, stopServer } = require('../../server');
const { test, expect } = require('@playwright/test');
const GraphQLClient = require('../../GraphQLClient');
const { chromium } = require('playwright'); 
require('dotenv').config();

let browser;
let page;

test.describe('GraphQLClient', () => {
  const authToken = process.env.JWT_TOKEN;
  const endpoint = process.env.GRAPHQL_ENDPOINT;
  let client;

  test.beforeAll(async () => {
    // await startServer();
    client = new GraphQLClient(endpoint, authToken);
    browser = await chromium.launch(); 
    page = await browser.newPage();
  });
  
  test.afterAll(async () => {
    await browser.close();
    // await stopServer();
  });
  
  // test.beforeEach(async () => {
  //   await resetDatabase();
  // });
  

  test('should perform a query', async () => {
    const query = `query { listProducts { id name price stock } }`;
    const data = await client.executeQuery(query);
    expect(data.listProducts).toBeDefined();
  });

  test('should handle errors for network issues', async () => {
    const invalidEndpointClient = new GraphQLClient('http://invalid-endpoint');
    const query = `query { listProducts { id name price stock } }`;
    await expect(invalidEndpointClient.executeQuery(query)).rejects.toThrow(/ENOTFOUND|ECONNREFUSED/);
  });
  
  test('should support authentication headers', async () => {
    const headers = client.authToken ? { Authorization: `Bearer ${client.authToken}` } : {};
    expect(headers.Authorization).toBe(`Bearer ${authToken}`);
  });  

  test('should perform a mutation', async () => {
    const mutation = `mutation ($name: String!, $price: Float!, $stock: Int!) {
      addProduct(name: $name, price: $price, stock: $stock) {
        id
        name
        price
        stock
      }
    }`;
    const variables = { name: 'Product C', price: 29.99, stock: 20 };
    const data = await client.executeMutation(mutation, variables);
    expect(data.addProduct).toBeDefined();
  });
});

