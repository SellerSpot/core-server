import { SOCKET_EVENTS } from 'config/socketEvents';
import { authController, subDomainController } from 'controllers';
import { Socket, Server } from 'socket.io';
import { IResponse, ITokenPayload } from 'typings/request.types';
import { logger } from 'utilities/logger';

const subDomainEvents = (io: Server, socket: Socket): void => {
    // create subdomain
    socket.on(SOCKET_EVENTS.SUB_DOMAIN.CREATE_SUB_DOMAIN, async (data, callback) => {
        logger(
            'socketio',
            `Event: ${SOCKET_EVENTS.SUB_DOMAIN.CREATE_SUB_DOMAIN}, ${JSON.stringify(data)}`,
        );
        let response: IResponse;
        try {
            const token = await authController.verifyToken(socket);
            if (!token.status) throw token;
            response = await subDomainController.createSubDomain({
                domainName: data.domainName,
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

    // update subdomain
    socket.on(SOCKET_EVENTS.SUB_DOMAIN.UPDATE_SUB_DOMAIN, async (data, callback) => {
        logger(
            'socketio',
            `Event: ${SOCKET_EVENTS.SUB_DOMAIN.UPDATE_SUB_DOMAIN}, ${JSON.stringify(data)}`,
        );
        let response: IResponse;
        try {
            const token = await authController.verifyToken(socket);
            if (!token.status) throw token;
            response = await subDomainController.updateSubDomain({
                domainName: data.domainName,
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

    // delete subdomain
    socket.on(SOCKET_EVENTS.SUB_DOMAIN.DELETE_SUB_DOMAIN, async (_data, callback) => {
        logger(
            'socketio',
            `Event: ${SOCKET_EVENTS.SUB_DOMAIN.DELETE_SUB_DOMAIN}, ${typeof callback}`,
        );
        let response: IResponse;
        try {
            const token = await authController.verifyToken(socket);
            if (!token.status) throw token;
            response = await subDomainController.deleteSubDomain({
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

    // subdomain availability check
    socket.on(SOCKET_EVENTS.SUB_DOMAIN.SUB_DOMAIN_AVAILABILITY_CHECK, async (data, callback) => {
        logger(
            'socketio',
            `Event: ${SOCKET_EVENTS.SUB_DOMAIN.SUB_DOMAIN_AVAILABILITY_CHECK}, ${JSON.stringify(
                data,
            )}`,
        );
        let response: IResponse;
        try {
            const token = await authController.verifyToken(socket);
            if (!token.status) throw token;
            response = await subDomainController.checkSubDomainAvailability(data);
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

export default subDomainEvents;
