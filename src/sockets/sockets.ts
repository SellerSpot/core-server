import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import nativeEvents from './native';
import baseEvents from './base';
import { SOCKET_EVENTS } from 'config/socketEvents';
import { logger } from 'utilities/logger';
import authEvents from './auth';
import subDomainEvents from './subDomain';
import appEvents from './app';

export const setSocketEventHandlers = (io: Server): void => {
    io.on(SOCKET_EVENTS.NATIVE.CONNECTION, (socket: Socket) => {
        nativeEvents(io, socket);
        baseEvents(io, socket);
        authEvents(io, socket);
        subDomainEvents(io, socket);
        appEvents(io, socket);
    });
    logger.socketio('All Socket Event Handlers Applied!');
};
