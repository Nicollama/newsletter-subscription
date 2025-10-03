"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
/**
 * Subscription Domain Entity.
 * Represents the business concept of a newsletter subscriber.
 */
class Subscription {
    constructor(email, createdAt) {
        this.email = email;
        this.createdAt = createdAt;
    }
    /**
     * Factory method to create a new Subscription instance.
     */
    static createNew(email) {
        return new Subscription(email, new Date());
    }
    /**
     * Factory method to create an existing Subscription instance (e.g., loaded from DB).
     */
    static createExisting(email, createdAt) {
        return new Subscription(email, createdAt);
    }
}
exports.Subscription = Subscription;
