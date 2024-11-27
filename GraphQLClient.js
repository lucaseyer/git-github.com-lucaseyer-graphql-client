const fetch = require('node-fetch');
require('dotenv').config();

class GraphQLClient {
  constructor(endpoint, authToken = null) {
    this.endpoint = endpoint;
    this.authToken = authToken;
  }

  async executeQuery(query, variables = {}) {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
        },
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();

      if (result.errors) {
        const error = new Error('GraphQL Error');
        error.response = result;
        throw error;
      }

      return result.data;
    } catch (error) {
      if (this.isTransientError(error)) {
        return error;
      }
      throw error;
    }
  }

  async executeMutation(mutation, variables = {}) {
    return this._sendRequest(mutation, variables);
  }

  async _sendRequest(body, variables) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const requestBody = JSON.stringify({ query: body, variables });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.debug('GraphQL Request:', requestBody);

        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: headers,
          body: requestBody,
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const responseBody = await response.json();
        if (responseBody.errors) {
          throw new Error(JSON.stringify(responseBody.errors));
        }

        return responseBody.data;
      } catch (error) {
        // console.error(`Attempt ${attempt} failed:`, error.message);
        if (attempt === 3) {
          throw error;
        }
        console.error(`Attempt ${attempt} failed:`, error.message);
      }
    }
  }
  isTransientError(error) {
    return error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT');
  }
}

// Exemplo de uso
const endpoint = process.env.GRAPHQL_ENDPOINT;
const authToken = process.env.JWT_TOKEN;

const client = new GraphQLClient(endpoint, authToken);

client.executeQuery('query { listProducts { id name price stock } }')
  .then(data => console.log(data))
  .catch(error => console.error(error));

module.exports = GraphQLClient;