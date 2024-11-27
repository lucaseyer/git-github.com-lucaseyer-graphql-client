const { setupServer } = require('msw/node');
const { graphql } = require('msw');

const server = setupServer(
  graphql.query('ListProducts', (req, res, ctx) => {
    return res(
      ctx.data({
        listProducts: [
          { id: '1', name: 'Product A', price: 10.0, stock: 100 },
          { id: '2', name: 'Product B', price: 20.0, stock: 200 },
        ],
      })
    );
  }),
  graphql.mutation('AddProduct', (req, res, ctx) => {
    const { name, price, stock } = req.variables;
    return res(
      ctx.data({
        addProduct: { id: '3', name, price, stock },
      })
    );
  }),
  graphql.query('ListProductsWithError', (req, res, ctx) => {
    return res(
      ctx.errors([
        {
          message: 'GraphQL error',
          locations: [{ line: 2, column: 3 }],
          path: ['listProducts'],
        },
      ])
    );
  })
);

module.exports = server;