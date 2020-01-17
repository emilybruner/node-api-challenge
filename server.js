const express = require('express');

const actionRouter = require('./data/helpers/actionRouter');
const projectRouter = require('./data/helpers/projectRouter');

const server = express();

// middleware

server.use(express.json())


//Routers
server.use('/api/projects', projectRouter)
server.use('/api/actions', actionRouter)

module.exports = server;