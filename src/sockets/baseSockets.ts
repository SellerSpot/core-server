import { Socket, Server } from 'socket.io';
import { logger } from 'utilities';

export const baseSockets = (io: Server, socket: Socket): void => {
    socket.on(SOCKET_EVENTS.NATIVE.CONNECTION, (data) => {
        logger('socketio', JSON.stringify(data));
    });
};
