import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { CONFIG } from 'config';
import { applyExpressMiddlewares } from 'config/expressConfig';
import { setSocketListeners } from './sockets';
import { logger } from 'utilities';

const app = express();
const httpServer = http.createServer(app);
const io: SocketServer = new SocketServer(httpServer, {
    cors: {
        origin: '*',
    },
});
// express routes
applyExpressMiddlewares(app);

// socket listeners
setSocketListeners(io);

// listeners
httpServer.listen(CONFIG.PORT, () => {
    logger('warning', `Server started at the port ${CONFIG.PORT}`);
});
