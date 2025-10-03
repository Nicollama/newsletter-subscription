import { EmailAddress } from './email-address';

/**
 * Subscription Domain Entity.
 * Represents the business concept of a newsletter subscriber.
 */
export class Subscription {
    // The EmailAddress Value Object ensures the email is always valid
    public readonly email: EmailAddress;
    public readonly createdAt: Date;

    private constructor(email: EmailAddress, createdAt: Date) {
        this.email = email;
        this.createdAt = createdAt;
    }

    /**
     * Factory method to create a new Subscription instance.
     */
    public static createNew(email: EmailAddress): Subscription {
        return new Subscription(email, new Date());
    }

    /**
     * Factory method to create an existing Subscription instance (e.g., loaded from DB).
     */
    public static createExisting(email: EmailAddress, createdAt: Date): Subscription {
        return new Subscription(email, createdAt);
    }
}