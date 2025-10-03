import { Request, Response } from 'express';
import { SubscribeToNewsletter } from '../../application/subscribe-newsletter';
import { SubscribeResponse } from '../../application/subscribe-dtos';
import { ValidationError } from '../../application/validation-error';

/**
 * Express Controller (Adapter) for handling HTTP requests and responses.
 * It translates infrastructure details (HTTP status codes) into Use Case results.
 */
export class SubscriptionController {
    private readonly useCase: SubscribeToNewsletter;

    constructor(useCase: SubscribeToNewsletter) {
        // Dependency Injection: Receives the Use Case
        this.useCase = useCase;
    }

    public async subscribe(req: Request, res: Response): Promise<void> {
        const rawEmail = req.body.email;
        
        try {
            // Call the Use Case with the raw input
            const response: SubscribeResponse = await this.useCase.execute({ rawEmail });

            // AC-NS-003: Success (HTTP 200 OK)
            res.status(200).json(response);

        } catch (error) {
            // Handle known application errors (Validation Error)
            if (error instanceof ValidationError) {
                // AC-NS-002: Client-side validation failure (HTTP 400 Bad Request)
                const response: SubscribeResponse = {
                    success: false,
                    status: error.status,
                    message: error.message,
                };
                res.status(400).json(response);
                return;
            }

            // AC-NS-005: Handle unexpected system errors (HTTP 500 Internal Server Error)
            console.error('Unhandled Controller Error:', error);
            const response: SubscribeResponse = {
                success: false,
                status: 'server_error',
                message: 'An unexpected server error occurred.',
            };
            res.status(500).json(response);
        }
    }
}