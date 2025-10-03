"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
// 1. Load environment variables
require("dotenv/config");
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
const subscribe_newsletter_1 = require("./src/application/subscribe-newsletter");
const subscription_controller_1 = require("./src/infrastructure/web/subscription-controller");
const postgres_subscription_repo_1 = require("./src/infrastructure/database/postgres-subscription-repo");
const SubscriptionDbEntity_1 = require("./src/infrastructure/database/entities/SubscriptionDbEntity");
// --- Database Configuration ---
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [SubscriptionDbEntity_1.SubscriptionDbEntity],
    synchronize: true,
    logging: false,
});
async function bootstrap() {
    try {
        await AppDataSource.initialize();
        console.log("✅ Database connection established and synchronized.");
        // Infrastructure layer
        const subscriptionRepository = new postgres_subscription_repo_1.PostgresSubscriptionRepository(AppDataSource);
        // Application layer
        const subscribeUseCase = new subscribe_newsletter_1.SubscribeToNewsletter(subscriptionRepository);
        // Web layer (controller)
        const subscriptionController = new subscription_controller_1.SubscriptionController(subscribeUseCase);
        // --- Express App ---
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)());
        app.use((0, express_1.json)());
        // Health check
        app.get('/health', (_, res) => res.status(200).send('OK'));
        // Subscribe endpoint
        app.post('/subscribe', (req, res) => subscriptionController.subscribe(req, res));
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("=========================================");
        console.error("❌ FATAL CONNECTION ERROR: Application Shut Down");
        console.error("=========================================");
        console.error("Please verify PostgreSQL credentials and database name.");
        console.error("--- RAW TYPEORM ERROR ---");
        console.error(error);
        console.error("-------------------------");
        process.exit(1);
    }
}
bootstrap();
