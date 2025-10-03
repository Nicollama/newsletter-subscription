/**
 * A custom error class used to signal validation failures within the application layer.
 * This allows the Use Case to throw a known error type that the Controller can catch 
 * and translate into a 400 Bad Request response.
 */
export class ValidationError extends Error {
    public status: 'email_required' | 'invalid_format';

    constructor(status: 'email_required' | 'invalid_format', message: string) {
        super(message);
        this.status = status;
        this.name = 'ValidationError';
    }
}