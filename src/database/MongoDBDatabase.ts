import {Db, MongoClient} from 'mongodb';
import { Config } from '../config/Config';

export class MongoDBDatabase {
    private database!: Db;
    private mongoClient!: MongoClient;
    private isSetup: boolean;

    public constructor() {
        this.isSetup = false;
    }

    public async setup(): Promise<void> {
        const config = Config.getDBConfig();

        this.mongoClient = await MongoClient.connect(config.connectionString);

        this.database = this.mongoClient.db();

        this.isSetup = true;
    }

    public getDatabase(): Db {
        return this.database;
    }

    public async closeClient(): Promise<void> {
        if (!this.isSetup) {
            return;
        }
        await this.mongoClient.close();
    }
}