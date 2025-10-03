import { EmailAddress } from './email-address';
import { Subscription } from './subscription';

/**
 * SubscriptionRepository is the Gateway Interface (Domain Contract).
 * This defines the necessary persistence methods for the Use Case.
 * The Use Case only knows about this interface, not the concrete implementation (e.g., PostgreSQL).
 */
export interface SubscriptionRepository {
    /**
     * AC-NS-001: Saves a new Subscription entity.
     */
    save(subscription: Subscription): Promise<void>;

    /**
     * AC-NS-004: Checks if a canonical email address already exists.
     */
    isSubscribed(email: EmailAddress): Promise<boolean>;
}
