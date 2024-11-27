const { server } = require('./mocks/server');

module.exports = async () => {
  server.close();
};