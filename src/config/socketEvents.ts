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
        DELETE_TENANT_ACCOUNT: 'deleteTenantAccount',
    },
    SUB_DOMAIN: {
        CREATE_SUB_DOMAIN: 'createsubdomain',
        UPDATE_SUB_DOMAIN: 'updatesubdomain',
        DELETE_SUB_DOMAIN: 'deletesubdomain',
        SUB_DOMAIN_AVAILABILITY_CHECK: 'subdomainavailabilitycheck',
    },
    APP: {
        GET_ALL_APPS: 'getallapps',
        GET_APP_BY_ID: 'getappbyid',
        GET_APP_BY_SLUG: 'getappbyslug',
        GET_TENANT_INSTALLED_APPS: 'gettenantinstalledapps',
        GET_TENANT_INSTALLED_APP_BY_ID: 'gettenantinstalledappbyid',
        GET_TENANT_INSTALLED_APP_BY_SLUG: 'gettenantinstalledappbyslug',
        INSTALL: 'installapp',
        UNINSTALL: 'uninstallapp',
        ADMIN_CREATE_APP: 'admincreateapp',
        ADMIN_DELETE_APP: 'admindelteapp',
        ADMIN_UPDATE_APP: 'adminupdateapp',
    },
};
