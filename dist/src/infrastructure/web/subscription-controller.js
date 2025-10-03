"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const validation_error_1 = require("../../application/validation-error");
/**
 * Express Controller (Adapter) for handling HTTP requests and responses.
 * It translates infrastructure details (HTTP status codes) into Use Case results.
 */
class SubscriptionController {
    constructor(useCase) {
        // Dependency Injection: Receives the Use Case
        this.useCase = useCase;
    }
    async subscribe(req, res) {
        const rawEmail = req.body.email;
        try {
            // Call the Use Case with the raw input
            const response = await this.useCase.execute({ rawEmail });
            // AC-NS-003: Success (HTTP 200 OK)
            res.status(200).json(response);
        }
        catch (error) {
            // Handle known application errors (Validation Error)
            if (error instanceof validation_error_1.ValidationError) {
                // AC-NS-002: Client-side validation failure (HTTP 400 Bad Request)
                const response = {
                    success: false,
                    status: error.status,
                    message: error.message,
                };
                res.status(400).json(response);
                return;
            }
            // AC-NS-005: Handle unexpected system errors (HTTP 500 Internal Server Error)
            console.error('Unhandled Controller Error:', error);
            const response = {
                success: false,
                status: 'server_error',
                message: 'An unexpected server error occurred.',
            };
            res.status(500).json(response);
        }
    }
}
exports.SubscriptionController = SubscriptionController;
