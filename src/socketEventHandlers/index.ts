import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import nativeEvents from './nativeEvents';
import baseEvents from './baseEvents';
import { SOCKET_EVENTS } from 'config/socketEvents';
import { logger } from 'utilities/logger';
import authEvents from './authEvents';

export const setSocketEventHandlers = (io: Server): void => {
    io.on(SOCKET_EVENTS.NATIVE.CONNECTION, (socket: Socket) => {
        nativeEvents(io, socket);
        baseEvents(io, socket);
        authEvents(io, socket);
    });
    logger('socketio', 'All Socket Event Handlers Applied!');
};
