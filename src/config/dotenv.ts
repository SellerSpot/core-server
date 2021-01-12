import dotenv from 'dotenv';
import { logger } from 'utilities/logger';

export const configureEnvironment = (): void => {
    try {
        const envConfig = dotenv.config();
        if (envConfig.error) throw new Error(`Env file config error ${envConfig.error.message}`);
        if (envConfig.parsed) {
            logger('common', 'Successfully imported environment variables');
            // overriedes the machince's envirionment variables if any specified in .env file
            for (const k in envConfig.parsed) {
                process.env[k] = envConfig.parsed[k];
            }
        }
    } catch (error) {
        logger('error', error.message ?? error);
    }
};
