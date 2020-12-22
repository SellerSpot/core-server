import { Router } from 'express';
import baseRouter from './baseRouter';

const rootRouter: Router = Router();

rootRouter.use('/basae', baseRouter);

export default rootRouter;
