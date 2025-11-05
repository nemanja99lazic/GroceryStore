import { IDBConfig } from "./db-config/IDBConfig";
import { IRestAPIConfig} from "./db-config/IRestAPIConfig";

export class Config {
    public static getDBConfig(): IDBConfig {
        if (!process.env.DB_CONNECTION_STRING) {
            throw new Error("Connection string env variable isn't set!");
        }

        return {
            connectionString: process.env.DB_CONNECTION_STRING
        };
    }

    public static getRestAPIConfig(): IRestAPIConfig {
        if (!process.env.HTTP_PORT) {
            throw new Error("Http port env variable isn't set");
        }

        return {
            httpPort: Number(process.env.HTTP_PORT)
        }
    }
}