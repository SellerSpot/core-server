import mongoose from 'mongoose';
import { logger } from 'utilities/logger';
import { CONFIG } from './config';
import * as models from 'models';
import { seedAppCollection, seedReservedDomainCollection } from './seedDb';
import { DB_NAMES } from 'models';

export const configureDB = (): void => {
    global.dbConnection = mongoose.createConnection(CONFIG.GET_DATABASE_CONNECTION_URL(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true,
    });
    global.dbConnection.on('error', (error) =>
        logger.mongoose(`Error Connecting to ${DB_NAMES.BASE_DB}, ${error.message}`),
    );
    global.dbConnection.once('open', () => {
        logger.mongoose(`database: Connected to ${DB_NAMES.BASE_DB}`);
        // database seed operations goes here
        seedAppCollection();
        seedReservedDomainCollection();
    });
    global.currentDb = global.dbConnection.useDb(DB_NAMES.BASE_DB);
    if (models.handshake === true) logger.mongoose(`Loaded All Monogoose Models`);
};
