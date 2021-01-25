import { SOCKET_EVENTS } from 'config/socketEvents';
import { authController, tenantController } from 'controllers/controllers';
import { Socket, Server } from 'socket.io';
import { IResponse, ITokenPayload } from 'typings/request.types';
import { logger } from 'utilities/logger';

const authEvents = (io: Server, socket: Socket): void => {
    /**
     * signsup a tenant
     * */
    socket.on(SOCKET_EVENTS.AUTH.SIGN_UP, async (data, callback) => {
        logger.socketio(`Event: ${SOCKET_EVENTS.AUTH.SIGN_UP}, ${JSON.stringify(data)}`);
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
    /**
     *  signs in a tenant
     */
    socket.on(SOCKET_EVENTS.AUTH.SIGN_IN, async (data, callback) => {
        logger.socketio(`Event: ${SOCKET_EVENTS.AUTH.SIGN_IN}, ${JSON.stringify(data)}`);
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

    /**
     * verifies token for a tenant and returns id and tenant related information that IJwtpayload interface has in it.
     */
    socket.on(SOCKET_EVENTS.AUTH.VERIFY_TOKEN, async (_data, callback) => {
        logger.socketio(`Event: ${SOCKET_EVENTS.AUTH.VERIFY_TOKEN} ${typeof callback}`);
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

    /**
     * deletes tenant account
     */
    socket.on(SOCKET_EVENTS.AUTH.DELETE_TENANT_ACCOUNT, async (_data, callback) => {
        logger.socketio(`Event: ${SOCKET_EVENTS.AUTH.DELETE_TENANT_ACCOUNT} ${typeof callback}`);
        let response: IResponse;
        try {
            const token = await authController.verifyToken(socket);
            if (!token.status) throw token;
            response = await tenantController.deleteTenant({
                tenantId: (<ITokenPayload>token.data).id,
            });
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
