import { SOCKET_EVENTS } from 'config/socketEvents';
import { baseController } from 'controllers';
import { Socket, Server } from 'socket.io';
import { IResponse } from 'typings/request.types';
import { logger } from 'utilities/logger';

const baseEvents = (io: Server, socket: Socket): void => {
    socket.on(SOCKET_EVENTS.BASE.HANDSHAKE, async (data, callback) => {
        logger('socketio', `Handshake event called with data ${JSON.stringify(data)}`);
        let response: IResponse;
        if (typeof callback !== 'function') {
            return socket.disconnect(); // not an acknowledgement
        }
        try {
            response = await baseController.performHandshake();
        } catch (error) {
            response = {
                status: false,
                statusCode: 500,
                data: 'Internal Server Error!',
            };
        }
        callback(response);
    });
};

export default baseEvents;
