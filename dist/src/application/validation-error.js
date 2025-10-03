"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
/**
 * A custom error class used to signal validation failures within the application layer.
 * This allows the Use Case to throw a known error type that the Controller can catch
 * and translate into a 400 Bad Request response.
 */
class ValidationError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
