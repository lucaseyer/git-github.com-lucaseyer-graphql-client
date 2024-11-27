import { graphql } from 'msw';

export const handlers = [
  graphql.operation((req, res, ctx) => {
    const { query } = req.body;

    if (query.includes('listProductsWithError')) {
      return res(
        ctx.errors([
          {
            message: 'Transient error',
            locations: [{ line: 2, column: 3 }],
            path: ['listProductsWithError'],
          },
        ])
      );
    }

    // Simulando um erro de rede
    if (Math.random() > 0.8) {
      return res(
        ctx.errors([
          {
            message: 'Network error occurred',
            extensions: { code: 'NETWORK_ERROR' },
          },
        ])
      );
    }

    // Simulando um erro GraphQL
    if (Math.random() > 0.5) {
      return res(
        ctx.errors([
          {
            message: 'Invalid field or missing argument',
            extensions: { code: 'GRAPHQL_VALIDATION_FAILED' },
          },
        ])
      );
    }

    // Retornando dados simulados
    return res(
      ctx.data({
        listProducts: [
          { id: '1', name: 'Product A', price: 49.99, stock: 10 },
          { id: '2', name: 'Product B', price: 99.99, stock: 5 },
          { id: '3', name: 'Product C', price: 29.99, stock: 20 },
        ],
      })
    );
  }),
];