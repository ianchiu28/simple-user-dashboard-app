const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const openApiSpecification = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
  },
  apis: [
    './routes/auth.js',
    './routes/users.js',
    './models/index.js',
    './models/users.js',
  ],
  host: 'https://simple-user-dashboard-app',
  tags: [{
    name: 'auth',
    description: 'Authentication APIs',
  }, {
    name: 'user',
    description: 'User related operations',
  }],
});

module.exports = (router) => {
  router.use('/apidoc', swaggerUi.serve, swaggerUi.setup(openApiSpecification));
};
