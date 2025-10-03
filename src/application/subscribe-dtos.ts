/**
 * Data Transfer Object for the Use Case Input.
 * This is the raw data received from the Controller (Infrastructure).
 */
export interface SubscribeRequest {
    rawEmail: string;
}

/**
 * Data Transfer Object for the Use Case Output.
 * This is structured data sent back to the Controller (Infrastructure).
 */
export interface SubscribeResponse {
    success: boolean;
    status: 'success' | 'email_required' | 'invalid_format' | 'already_subscribed' | 'server_error';
    message: string;
}