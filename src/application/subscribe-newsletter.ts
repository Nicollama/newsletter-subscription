import { SubscriptionRepository } from '../domain/subscription-repository';
import { EmailAddress } from '../domain/email-address';
import { Subscription } from '../domain/subscription';
import { SubscribeRequest, SubscribeResponse } from './subscribe-dtos';
import { ValidationError } from './validation-error';

/**
 * The core Use Case that orchestrates the business flow for subscription.
 * It is framework-independent and orchestrates interactions between Domain Entities (EmailAddress, Subscription) 
 * and Gateways (SubscriptionRepository).
 */
export class SubscribeToNewsletter {
    private readonly repository: SubscriptionRepository;

    constructor(repository: SubscriptionRepository) {
        // Dependency Injection: Receives the persistence gateway interface
        this.repository = repository;
    }

    public async execute(request: SubscribeRequest): Promise<SubscribeResponse> {
        const rawEmail = request.rawEmail ? request.rawEmail.trim() : '';

        // VR-NS-002: Check for required field
        if (!rawEmail) {
            throw new ValidationError('email_required', 'Please enter your email address.');
        }

        let email: EmailAddress;
        try {
            // VR-NS-001: Domain Validation (Email format check and canonicalization)
            email = EmailAddress.create(rawEmail);
        } catch (error) {
            // Catches error thrown by EmailAddress.create() on invalid format
            throw new ValidationError('invalid_format', 'The email address format is invalid.');
        }

        // AC-NS-004: Check if already subscribed (VR-NS-004)
        const isAlreadySubscribed = await this.repository.isSubscribed(email);

        if (isAlreadySubscribed) {
            return {
                success: false,
                status: 'already_subscribed',
                message: 'This email address is already subscribed to our newsletter.',
            };
        }

        try {
            // AC-NS-001: Create and save the new subscription
            const subscription = Subscription.createNew(email);
            await this.repository.save(subscription);

            // AC-NS-003: Success response
            return {
                success: true,
                status: 'success',
                message: 'Thank you for subscribing!',
            };
        } catch (error) {
            console.error('Database save error:', error);
            // AC-NS-005: Handle unexpected persistence errors
            return {
                success: false,
                status: 'server_error',
                message: 'A temporary server error occurred. Please try again later.',
            };
        }
    }
}
