This project demonstrates how to use a GraphQL client to perform queries and mutations on a GraphQL endpoint. The project is written in JavaScript and uses the `dotenv` library to manage environment variables.

## Prerequisites

- Node.js (version 12 or higher)
- npm (Node.js package manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lucaseyer/graphql-client.git
   cd graphql-client
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project and add the GraphQL endpoint URL:

   ```env
   GRAPHQL_ENDPOINT=http://localhost:4000/graphql
   JWT_TOKEN=yourtoken
   ```

## Project Structure

- `main.js`: Main file demonstrating the use of the GraphQL client.
- `GraphQLClient.js`: Implementation of the GraphQL client.
- `.env`: Configuration file for environment variables.

## Usage

To run the project, use the following command:

```bash
node main.js
```

## Libraries Used

- `dotenv`: Loads environment variables from a `.env` file into `process.env`.

## Features

The project includes the following features:

1. **Fetch product by ID**:
   - GraphQL query to fetch a product by its ID.

2. **List all products**:
   - GraphQL query to list all products.

3. **Add a new product**:
   - GraphQL mutation to add a new product.

4. **Update product stock**:
   - GraphQL mutation to update the stock of a product.

## Code Example

### main.js

```javascript
const GraphQLClient = require('./GraphQLClient');
require('dotenv').config();

// Initialize the client with the GraphQL endpoint
const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql');

async function fetchProductById(id) {
  const productQuery = `
    query ($id: ID!) {
      getProduct(id: $id) {
        id
        name
        price
        stock
      }
    }
  `;
  return await client.executeQuery(productQuery, { id });
}

async function listAllProducts() {
  const listProductsQuery = `
    query {
      listProducts {
        id
        name
        price
        stock
      }
    }
  `;
  return await client.executeQuery(listProductsQuery);
}

async function addNewProduct(name, price, stock) {
  const addProductMutation = `
    mutation ($name: String!, $price: Float!, $stock: Int!) {
      addProduct(name: $name, price: $price, stock: $stock) {
        id
        name
        price
        stock
      }
    }
  `;
  return await client.executeMutation(addProductMutation, { name, price, stock });
}

async function updateProductStock(id, stock) {
  const updateStockMutation = `
    mutation ($id: ID!, $stock: Int!) {
      updateStock(id: $id, stock: $stock) {
        id
        stock
      }
    }
  `;
  return await client.executeMutation(updateStockMutation, { id, stock });
}

// Demonstration of usage
(async () => {
  try {
    console.log('Fetching product by ID...');
    const product = await fetchProductById('1');
    console.log('Product fetched:', product);

    console.log('Listing all products...');
    const allProducts = await listAllProducts();
    console.log('All products:', allProducts);

    console.log('Adding a new product...');
    const newProduct = await addNewProduct('Product D', 199.99, 30);
    console.log('New product added:', newProduct);

    console.log('Updating product stock...');
    const updatedProduct = await updateProductStock('1', 100);
    console.log('Product stock updated:', updatedProduct);

  } catch (error) {
    console.error('Error during demonstration:', error.message);
  }
})();
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Running the Server
To run the server, follow these steps:
1. Make sure you have the necessary dependencies installed. If not, run `npm install` in the root of the project.
2. Start the server by running the following command:
    ```bash
    node server.js
    ```
    This will start the server and make it available at `http://localhost:4000/graphql`.

## Running Tests
To run the unit tests, use the following command:
    ```bash
    npm run test
    ```

To run the E2E tests, use the following command:
    ```bash
    npm run test:e2e
    ```

