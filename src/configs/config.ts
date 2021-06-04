import { DB_NAMES } from '@sellerspot/database-models';
import dotenv from 'dotenv';
import path from 'path';

process.env.ENV === 'production'
    ? dotenv.config()
    : dotenv.config({ path: path.resolve('./.env.development'), debug: true });

export const CONFIG = {
    ENV: process.env.ENV,
    PORT: parseInt(process.env.PORT),
    DATABASE_SERVER_URL: process.env.DATABASE_SERVER_URL,
    DATABASE_SERVER_QUERY: process.env.DATABASE_SERVER_QUERY,
    GET_DATABASE_CONNECTION_URL: (): string =>
        CONFIG.DATABASE_SERVER_URL + DB_NAMES.CORE_DB + CONFIG.DATABASE_SERVER_QUERY,
    APP_NAME: process.env.APP_NAME,
    APP_SECRET: process.env.APP_SECRET,
    DOMAIN: process.env.DOMAIN,

    // local constants
    CORE_APP_DEV_PORT: 7003,
    CORE_APP_SUBDOMAIN_NAME: 'app',
    /**
     * expressed in seconds 2 days (172800)
     */
    COOKIE_MAX_AGE: 172800,
};
