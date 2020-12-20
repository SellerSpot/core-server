import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { CONFIG } from 'config';
import { logger } from 'utils';

const app = express();
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer, {
    cors: {
        origin: '*',
    },
});

// http routes

// socket listeners

// listeners
httpServer.listen(CONFIG.PORT, () => {
    logger('warning', `Server started at the port ${CONFIG.PORT}`);
});
