// This file gets the server running. 

const http = require('http') // This is the only import syntax supported in node
const app = require('./app')

const port = process.env.PORT || 3000

const server = http.createServer(app)

server.listen(port, () => console.log(`Server running on port ${port}`)) // Start listening on the port