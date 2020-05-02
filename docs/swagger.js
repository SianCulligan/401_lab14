'use strict';

const express = require('express');
const app = express();

const generateSwagger = (app) => {
  const expressSwagger = require('express-swagger-generator')(app);
  let options = {
    swaggerDefinition: {
      info: {
        description: 'Access  CRUD operations for products and categories',
        title: 'My Swagger Server',
        version: '1.0.0',
      },
      host: 'localhost:3000',
      // ^ what your exress server is running on
      basePath: '/',
      produces: [ 'application/json', 'text/html' ],
      schemes: ['http'],
      securityDefinitions: {
        JWT: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: '',
        },
      },
    },
    basedir: __dirname,
    files: ['../lib/server.js', '../lib/routes/auth-routes.js'], 
  };
  expressSwagger(options);
};
app.listen(3001);

module.exports = generateSwagger;