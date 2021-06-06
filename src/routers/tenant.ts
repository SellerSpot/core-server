import { middlewares } from '@sellerspot/universal-functions';
import { ROUTES } from '@sellerspot/universal-types';
import { tenantController } from 'controllers/controller';
import { Router } from 'express';

const router = Router();

router.delete(ROUTES.CORE.DELETE_TENANT, middlewares.auth, tenantController.deleteTenant);

export default router;
