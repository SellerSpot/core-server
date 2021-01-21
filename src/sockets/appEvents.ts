import { SOCKET_EVENTS } from 'config/socketEvents';
import { appController, authController } from 'controllers';
import { baseDbModels } from 'models';
import { Socket, Server } from 'socket.io';
import { IResponse, ITokenPayload } from 'typings/request.types';
import { logger } from 'utilities/logger';

const appEvents = (io: Server, socket: Socket): void => {
    /* tenant events */
    // get all apps
    socket.on(SOCKET_EVENTS.APP.GET_ALL_APPS, async (_data, callback) => {
        logger(
            'socketio',
            `Event: ${SOCKET_EVENTS.APP.GET_ALL_APPS}, ${JSON.stringify(typeof callback)}`,
        );
        let response: IResponse;
        try {
            response = await appController.getAllApps();
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

    // get app by id
    socket.on(SOCKET_EVENTS.APP.GET_APP_BY_ID, async (data: { appId: string }, callback) => {
        logger('socketio', `Event: ${SOCKET_EVENTS.APP.GET_APP_BY_ID}, ${JSON.stringify(data)}`);
        let response: IResponse;
        try {
            response = await appController.getAppByIdOrSlug(data.appId);
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

    // get app by slug
    socket.on(SOCKET_EVENTS.APP.GET_APP_BY_SLUG, async (data: { appId: string }, callback) => {
        logger('socketio', `Event: ${SOCKET_EVENTS.APP.GET_APP_BY_SLUG}, ${JSON.stringify(data)}`);
        let response: IResponse;
        try {
            response = await appController.getAppByIdOrSlug(data.appId, true);
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

    // get teanant installed app by id and tenant id
    socket.on(
        SOCKET_EVENTS.APP.GET_TENANT_INSTALLED_APP_BY_ID,
        async (data: { appId: string }, callback) => {
            logger(
                'socketio',
                `Event: ${SOCKET_EVENTS.APP.GET_TENANT_INSTALLED_APP_BY_ID}, ${JSON.stringify(
                    data,
                )}`,
            );
            let response: IResponse;
            try {
                const token = await authController.verifyToken(socket);
                if (!token.status) throw token;
                response = await appController.getTenantInstalledAppByIdOrSlug({
                    appIdOrSlug: data.appId,
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
        },
    );

    // get teanant installed app by slug and tenant id
    socket.on(
        SOCKET_EVENTS.APP.GET_TENANT_INSTALLED_APP_BY_SLUG,
        async (data: { appId: string }, callback) => {
            logger(
                'socketio',
                `Event: ${SOCKET_EVENTS.APP.GET_TENANT_INSTALLED_APP_BY_SLUG}, ${JSON.stringify(
                    data,
                )}`,
            );
            let response: IResponse;
            try {
                const token = await authController.verifyToken(socket);
                if (!token.status) throw token;
                response = await appController.getTenantInstalledAppByIdOrSlug(
                    {
                        appIdOrSlug: data.appId,
                        tenantId: (<ITokenPayload>token.data).id,
                    },
                    true,
                );
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
        },
    );

    // get tenant installed apps using tenant id
    socket.on(SOCKET_EVENTS.APP.GET_TENANT_INSTALLED_APPS, async (_data, callback) => {
        logger(
            'socketio',
            `Event: ${SOCKET_EVENTS.APP.GET_TENANT_INSTALLED_APPS}, ${typeof callback}`,
        );
        let response: IResponse;
        try {
            const token = await authController.verifyToken(socket);
            if (!token.status) throw token;
            response = await appController.getTenantInstalledApps({
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

    // install app
    socket.on(SOCKET_EVENTS.APP.INSTALL, async (data: { appId: string }, callback) => {
        logger('socketio', `Event: ${SOCKET_EVENTS.APP.INSTALL}, ${JSON.stringify(data)}`);
        let response: IResponse;
        try {
            const token = await authController.verifyToken(socket);
            if (!token.status) throw token;
            response = await appController.installApp({
                appId: data.appId,
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

    // uninstall app
    socket.on(SOCKET_EVENTS.APP.UNINSTALL, async (data: { appId: string }, callback) => {
        logger('socketio', `Event: ${SOCKET_EVENTS.APP.UNINSTALL}, ${JSON.stringify(data)}`);
        let response: IResponse;
        try {
            const token = await authController.verifyToken(socket);
            if (!token.status) throw token;
            response = await appController.unInstallApp({
                appId: data.appId,
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

    /* admin events */
    // create app
    // admin validation is not yet comleted yet to integrate validation mechanism for admin tenant separation
    socket.on(
        SOCKET_EVENTS.APP.ADMIN_CREATE_APP,
        async (data: baseDbModels.AppModel.IApp, callback) => {
            logger(
                'socketio',
                `Event: ${SOCKET_EVENTS.APP.ADMIN_CREATE_APP}, ${JSON.stringify(data)}`,
            );
            let response: IResponse;
            try {
                const token = await authController.verifyToken(socket);
                if (!token.status) throw token;
                response = await appController.adminCreateNewApp(data);
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
        },
    );

    // delete app
    socket.on(SOCKET_EVENTS.APP.ADMIN_DELETE_APP, async (data: { appId: string }, callback) => {
        logger('socketio', `Event: ${SOCKET_EVENTS.APP.ADMIN_DELETE_APP}, ${JSON.stringify(data)}`);
        let response: IResponse;
        try {
            const token = await authController.verifyToken(socket);
            if (!token.status) throw token;
            response = await appController.adminDeleteApp(data.appId);
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

export default appEvents;
