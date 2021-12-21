class ErrorResponse extends Error {
    constructor(statusCode, status, message) {
        super(message)
        this.statusCode = statusCode
        this.status = status
        this.message = message
    }
}

module.exports = ErrorResponse
