"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresSubscriptionRepository = void 0;
const SubscriptionDbEntity_1 = require("./entities/SubscriptionDbEntity");
/**
 * Concrete implementation of the SubscriptionRepository interface using TypeORM and PostgreSQL.
 * This adapter lives in the Infrastructure layer.
 */
class PostgresSubscriptionRepository {
    constructor(dataSource) {
        // Receives the initialized TypeORM DataSource
        this.ormRepository = dataSource.getRepository(SubscriptionDbEntity_1.SubscriptionDbEntity);
    }
    /**
     * AC-NS-004: Checks for existence using the canonical email address.
     */
    async isSubscribed(email) {
        // VR-NS-006: Use the canonical value for the lookup
        const count = await this.ormRepository.count({
            where: { email: email.getValue() },
        });
        return count > 0;
    }
    /**
     * AC-NS-001: Saves the Subscription to the database.
     */
    async save(subscription) {
        const entity = new SubscriptionDbEntity_1.SubscriptionDbEntity();
        // Map domain entity data to DB entity data
        entity.email = subscription.email.getValue();
        entity.createdAt = subscription.createdAt;
        // Note: TypeORM save() handles both insert and update (upsert behavior on PrimaryColumn)
        await this.ormRepository.save(entity);
    }
}
exports.PostgresSubscriptionRepository = PostgresSubscriptionRepository;
