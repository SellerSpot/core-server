// mongoose connection reference handShake
export const handshake = true;

// database name exports
export * from './dbNames';

// model name exports
export * from './mongooseModels';

// database models exports
export * as baseDbModels from './baseDb';
export * as tenantDbModels from './tenantDb';
export * as appDbModels from './appDb';
