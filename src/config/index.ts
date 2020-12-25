export const CONFIG = {
    ENV: process.env.ENV,
    PORT: 5000,
    DATABASE_SERVER_URL: 'mongodb://127.0.0.1:27017/',
    BASE_DB_NAME: 'sellerspot-core',
    GET_DATABASE_CONNECTION_URL: (): string => CONFIG.DATABASE_SERVER_URL + CONFIG.BASE_DB_NAME,
    JWT_SECRET: 'sellerspot_ecosystem',
};
