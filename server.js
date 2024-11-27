const { ApolloServer} = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
// const { MongoClient } = require('mongodb'); 
const { gql } = require('graphql-tag');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_TOKEN;

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
    stock: Int!
  }

  type Query {
    getProduct(id: ID!): Product
    listProducts: [Product]
  }

  type Mutation {
    addProduct(name: String!, price: Float!, stock: Int!): Product
    updateStock(id: ID!, stock: Int!): Product
  }
`;

let httpServer; 
let serverInstance;


// Mock data for testing
global.products = [
  { id: '1', name: 'Product A', price: 49.99, stock: 10 },
  { id: '2', name: 'Product B', price: 99.99, stock: 5 },
];

// Resolvers to handle queries and mutations
const resolvers = {
  Query: {
    getProduct: (_, { id }) => {
      console.log(`Fetching product with ID: ${id}`);
      return global.products.find(product => product.id === id);
    },
    listProducts: () => {
      console.log('Listing all products');
      return global.products;
    },
  },
  Mutation: {
    addProduct: (_, { name, price, stock }) => {
      const newProduct = {
        id: String(global.products.length + 1),
        name,
        price,
        stock,
      };
      global.products.push(newProduct);
      console.log(`Added product: ${name}`);
      return newProduct;
    },
    updateStock: (_, { id, stock }) => {
      const product = global.products.find(product => product.id === id);
      if (product) {
        product.stock = stock;
        console.log(`Updated stock for product ID: ${id}`);
        return product;
      }
      throw new Error(`Product with ID: ${id} not found`);
    },
  },
};

//auth
const authenticateToken = (token) => {
    if (!token) {
      throw new Error('No token provided');
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  };
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.split(' ')[1];
      let user = null;
      if (token) {
        try {
          user = authenticateToken(token);
        } catch (err) {
          console.error(err.message);
        }
      }
      return { user };
    },
  });
  
  startStandaloneServer(server, {
    listen: { port: 4000 },
  }).then(({ url }) => {
    console.log(`*** Server ready at ${url}`);
  });


  async function startServer() {
    try {
      serverInstance = await startStandaloneServer(server, {
        listen: { port: 4000 },
      }).then(({ url }) => {
        console.log(`*** Server ready at ${url}`);
        return server; 
      });
  
    //   client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
    //   await client.connect();
    //   db = client.db('testdb'); 
    } catch (error) {
      console.error('Failed to start server:', error);
      throw error;
    }
  }

  async function stopServer() {
    if (serverInstance) {
      await serverInstance.stop();
    }
  }
  
//   async function resetDatabase() {
    //  pass
    // try {
    //   const collections = await db.collections();
    //   for (let collection of collections) {
    //     await collection.deleteMany({});
    //   }
    //   await db.collection('products').insertMany([
    //     { id: '1', name: 'Product A', price: 49.99, stock: 10 },
    //     { id: '2', name: 'Product B', price: 99.99, stock: 5 },
    //     { id: '3', name: 'Product C', price: 29.99, stock: 20 },
        
    //   ]);
    // } catch (error) {
    //   console.error('Failed to reset database:', error);
    //   throw error;
    // }
//   }

  module.exports = { startServer, stopServer };