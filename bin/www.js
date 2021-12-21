const http = require('http')
const app = require('../server/index')

/* Normalize Port  into number*/

function normalizePort(val) {
    const port = parseInt(val, 10)
    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }
    return false
}

/* Get port from environment and store in Express. */
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

/* Create HTTP server. */
const server = http.createServer(app)

/* Event listener for HTTP server "error" event. */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
        default:
            throw error
    }
}

/* Event listener for HTTP server "listening" event. */
function onListening() {
    const addr = server.address()
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    console.log(` Server is running in ${process.env.NODE_ENV} mode on  ${port}`)
}

/* Listen on provided port, on all network interfaces. */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...')
    console.log(err.name, err.message)
    process.exit(1)
})
