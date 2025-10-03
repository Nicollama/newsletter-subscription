import { Entity, Column, PrimaryColumn } from 'typeorm';

/**
 * TypeORM Entity mapping the Subscription Domain concept to a PostgreSQL table.
 * The primary key is the canonical (lowercase) email address.
 */
@Entity('subscriptions')
export class SubscriptionDbEntity {
    // Primary key: The canonical email address (VR-NS-006: ensures case insensitivity at DB level)
    @PrimaryColumn({ type: 'varchar', length: 255 })
    email!: string;

    @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;
}
