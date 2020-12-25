import { SOCKET_EVENTS } from 'config/socketEvents';
import { authController } from 'controllers';
import { Socket, Server } from 'socket.io';
import { IResponse } from 'typings/request.types';
import { logger } from 'utilities/logger';

const authEvents = (io: Server, socket: Socket): void => {
    // signup event
    socket.on(SOCKET_EVENTS.AUTH.SIGN_UP, async (data, callback) => {
        logger('socketio', `Event: ${SOCKET_EVENTS.AUTH.SIGN_UP}, ${JSON.stringify(data)}`);
        let response: IResponse;
        if (typeof callback !== 'function') {
            return socket.disconnect(); // not an acknowledgement
        }
        try {
            response = await authController.SignUpTenant(data);
        } catch (error) {
            if (error.status !== undefined) {
                response = error;
            } else {
                response = {
                    status: false,
                    statusCode: 500,
                    data: 'Internal Server Error!',
                };
            }
        }
        callback(response);
    });

    // signin event
    socket.on(SOCKET_EVENTS.AUTH.SIGN_IN, async (data, callback) => {
        logger('socketio', `Event: ${SOCKET_EVENTS.AUTH.SIGN_IN}, ${JSON.stringify(data)}`);
        let response: IResponse;
        if (typeof callback !== 'function') {
            return socket.disconnect(); // not an acknowledgement
        }
        try {
            response = await authController.SignInTenant(data);
        } catch (error) {
            if (error.status !== undefined) {
                response = error;
            } else {
                response = {
                    status: false,
                    statusCode: 500,
                    data: 'Internal Server Error!',
                };
            }
        }
        callback(response);
    });
};

export default authEvents;
