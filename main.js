const GraphQLClient = require('./GraphQLClient');
require('dotenv').config();

// Inicializa o cliente com o endpoint GraphQL
const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT);

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

// Demonstração de uso
(async () => {
    try {
      console.log('Fetching product by ID...');
      const product = await fetchProductById('1');
      console.log('Product fetched:', JSON.stringify(product, null, 2));
  
      console.log('Listing all products...');
      const allProducts = await listAllProducts();
      console.log('All products:', JSON.stringify(allProducts, null, 2));
  
      console.log('Adding a new product...');
      const newProduct = await addNewProduct('Product D', 199.99, 30);
      console.log('New product added:', JSON.stringify(newProduct, null, 2));
  
      console.log('Updating product stock...');
      const updatedProduct = await updateProductStock('1', 100);
      console.log('Product stock updated:', JSON.stringify(updatedProduct, null, 2));
    } catch (error) {
      console.error('Error during demonstration:', error);
    }
  })();