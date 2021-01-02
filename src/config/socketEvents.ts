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
};
