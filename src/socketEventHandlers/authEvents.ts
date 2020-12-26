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

    socket.on(SOCKET_EVENTS.AUTH.VERIFY_TOKEN, async (_data, callback) => {
        logger('socketio', `Event: ${SOCKET_EVENTS.AUTH.VERIFY_TOKEN} ${typeof callback}`);
        let response: IResponse;
        try {
            response = await authController.verifyToken(socket);
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
