import { SOCKET_EVENTS } from 'config/socketEvents';
import { Socket, Server } from 'socket.io';
import { logger } from 'utilities/logger';

const nativeEvents = (io: Server, socket: Socket): void => {
    logger('socketio', 'A user Connected!');
    socket.on(SOCKET_EVENTS.NATIVE.DISCONNECT, () => {
        logger('socketio', 'A user Disconnected!');
    });
};

export default nativeEvents;
