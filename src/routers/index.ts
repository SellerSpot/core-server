import { Router } from 'express';
import baseRouter from './baseRouter';

const rootRouter: Router = Router();

rootRouter.use('/', baseRouter);

export default rootRouter;
