import { middlewares } from '@sellerspot/universal-functions';
import { ROUTES } from '@sellerspot/universal-types';
import { TenantController } from 'controllers/controllers';
import { Router } from 'express';

const router = Router();

router.delete(ROUTES.CORE.TENANT.DELETE_TENANT, middlewares.auth, TenantController.deleteTenant);

export default router;
