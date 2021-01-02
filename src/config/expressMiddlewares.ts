import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { CONFIG } from './config';

export const applyExpressMiddlewares = (app: Application): void => {
    const isDevelopment = CONFIG.ENV === 'development';
    app.use(express.json());
    app.use(morgan(isDevelopment ? 'dev' : 'short'));
    app.use(cors());
};
