import { DataSource, Repository } from 'typeorm';
import { SubscriptionRepository } from '../../domain/subscription-repository';
import { EmailAddress } from '../../domain/email-address';
import { Subscription } from '../../domain/subscription';
import { SubscriptionDbEntity } from './entities/SubscriptionDbEntity';

/**
 * Concrete implementation of the SubscriptionRepository interface using TypeORM and PostgreSQL.
 * This adapter lives in the Infrastructure layer.
 */
export class PostgresSubscriptionRepository implements SubscriptionRepository {
    private readonly ormRepository: Repository<SubscriptionDbEntity>;

    constructor(dataSource: DataSource) {
        // Receives the initialized TypeORM DataSource
        this.ormRepository = dataSource.getRepository(SubscriptionDbEntity);
    }

    /**
     * AC-NS-004: Checks for existence using the canonical email address.
     */
    public async isSubscribed(email: EmailAddress): Promise<boolean> {
        // VR-NS-006: Use the canonical value for the lookup
        const count= await this.ormRepository.count({
            where: { email: email.getValue() },
        });
        return count > 0;
    }

    /**
     * AC-NS-001: Saves the Subscription to the database.
     */
    public async save(subscription: Subscription): Promise<void> {
        const entity = new SubscriptionDbEntity();
        
        // Map domain entity data to DB entity data
        entity.email = subscription.email.getValue();
        entity.createdAt = subscription.createdAt;

        // Note: TypeORM save() handles both insert and update (upsert behavior on PrimaryColumn)
        await this.ormRepository.save(entity);
    }
}
