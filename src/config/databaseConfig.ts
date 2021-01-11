import mongoose from 'mongoose';
import { logger } from 'utilities/logger';
import { CONFIG } from './config';
import * as models from 'models';
import { seedAppCollection, seedReservedDomainCollection } from './seedDb';

export const configureDB = (): void => {
    global.dbConnection = mongoose.createConnection(CONFIG.GET_DATABASE_CONNECTION_URL(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true,
    });
    global.dbConnection.on('error', (error) =>
        logger('mongoose', `Error Connecting to ${CONFIG.BASE_DB_NAME}, ${error.message}`),
    );
    global.dbConnection.once('open', () => {
        logger('mongoose', `database: Connected to ${CONFIG.BASE_DB_NAME}`);
        // database seed operations goes here
        seedAppCollection();
        seedReservedDomainCollection();
    });
    global.currentDb = global.dbConnection.useDb(CONFIG.BASE_DB_NAME);
    if (models.handshake === true) logger('mongoose', `Loaded All Monogoose Models`);
};
