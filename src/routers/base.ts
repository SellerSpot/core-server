import { baseController } from 'controllers/controllers';
import { Router } from 'express';

const baseRouter = Router();

baseRouter.get('/', async (req, res) => {
    const response = await baseController.performHandshake();
    res.send(response);
});

export default baseRouter;
