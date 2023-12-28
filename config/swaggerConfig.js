const path = require('path')
const swaggerJSDoc = require('swagger-jsdoc')

const options = {
     definition: {
         openapi: '3.0.0',
         info: {
             title: 'Consultorio VX',
             version: '1.0.0',
             description: 'Documentación de la API de consultorio',
         },
         servers: [{
             url: 'http://localhost:3000'
         }],
     },
     apis: [path.join(__dirname, '../routes/*.js')]
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec