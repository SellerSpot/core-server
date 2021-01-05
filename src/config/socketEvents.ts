export const SOCKET_EVENTS = {
    NATIVE: {
        CONNECTION: 'connection',
        DISCONNECT: 'disconnect',
    },
    BASE: {
        HANDSHAKE: 'handshake',
    },
    AUTH: {
        SIGN_UP: 'signup',
        SIGN_IN: 'signin',
        VERIFY_TOKEN: 'verifytoken',
    },
    SUB_DOMAIN: {
        CREATE_SUB_DOMAIN: 'createsubdomain',
        UPDATE_SUB_DOMAIN: 'updatesubdomain',
        SUB_DOMAIN_AVAILABILITY_CHECK: 'subdomainavailabilitycheck',
    },
    APP: {
        GET_ALL_APPS: 'getallapps',
        GET_APP_BY_ID: 'getappbyid',
        GET_TENANT_INSTALLED_APPS: 'gettenantinstalledapps',
        GET_TENANT_INSTALLED_APP_BY_ID: 'gettenantinstalledappbyid',
        INSTALL: 'installapp',
        UNINSTALL: 'uninstallapp',
        ADMIN_CREATE_APP: 'admincreateapp',
        ADMIN_DELETE_APP: 'admindelteapp',
        ADMIN_UPDATE_APP: 'adminupdateapp',
    },
};
