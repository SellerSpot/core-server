import { ROUTES } from '@sellerspot/universal-types';
import { PluginController } from 'controllers/controllers';
import { Router } from 'express';
import { middlewares } from '../../.yalc/@sellerspot/universal-functions/dist';

const router = Router();

router.get(ROUTES.CORE.GET_ALL_PLUGINS, PluginController.getAllPlugins);

router.post(ROUTES.CORE.INSTALL_PLUGIN, middlewares.auth, PluginController.installPlugin);

export default router;
