// 1. Load environment variables
import 'dotenv/config';

import express, { json } from 'express';
import cors from 'cors';
import path from 'path';
import { DataSource } from 'typeorm';
import { SubscribeToNewsletter } from './src/application/subscribe-newsletter';
import { SubscriptionController } from './src/infrastructure/web/subscription-controller';
import { PostgresSubscriptionRepository } from './src/infrastructure/database/postgres-subscription-repo';
import { SubscriptionDbEntity } from './src/infrastructure/database/entities/SubscriptionDbEntity';

// --- Database Configuration ---
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [SubscriptionDbEntity],
  synchronize: true,
  logging: false,
});

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connection established and synchronized.");

    // Infrastructure layer
    const subscriptionRepository = new PostgresSubscriptionRepository(AppDataSource);

    // Application layer
    const subscribeUseCase = new SubscribeToNewsletter(subscriptionRepository);

    // Web layer (controller)
    const subscriptionController = new SubscriptionController(subscribeUseCase);

    // --- Express App ---
    const app = express();
    app.use(cors());
    app.use(json());

    // 👉 Serve static frontend (index.html, css, js)
    app.use(express.static(path.join(__dirname, "../public")));

    // Health check
    app.get('/health', (_, res) => res.status(200).send('OK'));

    // API endpoint
    app.post('/subscribe', (req, res) => subscriptionController.subscribe(req, res));

    // 👉 Catch-all: serve index.html for root and unknown routes
    app.get("*", (_, res) => {
      res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
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
