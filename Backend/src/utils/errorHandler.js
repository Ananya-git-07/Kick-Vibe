/**
 * @class ApiError
 * @extends Error
 * A custom error class for handling API-specific errors in a structured way.
 */
class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}


/**
 * @function errorHandler
 * The global error handling middleware for the Express application.
 * It catches all errors passed via `next(err)` and sends a standardized response.
 */
const errorHandler = (err, req, res, next) => {
    // Default to 500 if the error doesn't have a specific status code.
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    // Send a structured JSON response to the client.
    return res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || []
    });
};

// Export both the class and the handler function.
export { ApiError, errorHandler };