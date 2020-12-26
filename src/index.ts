import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { CONFIG } from 'config';
import { applyExpressMiddlewares } from 'config/expressMiddlewares';
import { logger } from 'utilities/logger';
import { setSocketEventHandlers } from 'socketEventHandlers';
import rootRouter from './routers';
import { configureDB } from 'config/databaseConfig';

// initializers
const app = express();
const httpServer = http.createServer(app);
const io: SocketServer = new SocketServer(httpServer, {
    cors: {
        origin: '*',
    },
});

// initialize mongoose and load models (different from traditional way - that this structure is optimzed of multi-tenant ecosystem)
configureDB();

// express middleware
applyExpressMiddlewares(app);

// express router
app.use('/', rootRouter);

// socket event handler
setSocketEventHandlers(io);

// http listener
httpServer.listen(CONFIG.PORT, () => {
    logger('express', `Server started at the port ${CONFIG.PORT}`);
});
