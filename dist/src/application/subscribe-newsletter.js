"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeToNewsletter = void 0;
const email_address_1 = require("../domain/email-address");
const subscription_1 = require("../domain/subscription");
const validation_error_1 = require("./validation-error");
/**
 * The core Use Case that orchestrates the business flow for subscription.
 * It is framework-independent and orchestrates interactions between Domain Entities (EmailAddress, Subscription)
 * and Gateways (SubscriptionRepository).
 */
class SubscribeToNewsletter {
    constructor(repository) {
        // Dependency Injection: Receives the persistence gateway interface
        this.repository = repository;
    }
    async execute(request) {
        const rawEmail = request.rawEmail ? request.rawEmail.trim() : '';
        // VR-NS-002: Check for required field
        if (!rawEmail) {
            throw new validation_error_1.ValidationError('email_required', 'Please enter your email address.');
        }
        let email;
        try {
            // VR-NS-001: Domain Validation (Email format check and canonicalization)
            email = email_address_1.EmailAddress.create(rawEmail);
        }
        catch (error) {
            // Catches error thrown by EmailAddress.create() on invalid format
            throw new validation_error_1.ValidationError('invalid_format', 'The email address format is invalid.');
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
            const subscription = subscription_1.Subscription.createNew(email);
            await this.repository.save(subscription);
            // AC-NS-003: Success response
            return {
                success: true,
                status: 'success',
                message: 'Thank you for subscribing!',
            };
        }
        catch (error) {
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
exports.SubscribeToNewsletter = SubscribeToNewsletter;
