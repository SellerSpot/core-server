import { Router } from 'express';
import baseRouter from './base';

const rootRouter: Router = Router();

rootRouter.use('/', baseRouter);

export default rootRouter;
