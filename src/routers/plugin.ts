import { ROUTES } from '@sellerspot/universal-types';
import { PluginController } from 'controllers/controllers';
import { Router } from 'express';
import PluginSchema from 'schemas/PluginSchema';
import { middlewares } from '../../.yalc/@sellerspot/universal-functions/dist';

const router = Router();

router.get(ROUTES.CORE.GET_ALL_PLUGINS, PluginController.getAllPlugins);

router.post(
    ROUTES.CORE.INSTALL_PLUGIN,
    middlewares.auth,
    middlewares.validateSchema({ pathParamSchema: PluginSchema.installPluginSchema }),
    PluginController.installPlugin,
);

router.delete(
    ROUTES.CORE.UNINSTALL_PLUGIN,
    middlewares.auth,
    middlewares.validateSchema({ pathParamSchema: PluginSchema.unInstallPluginSchema }),
    PluginController.unInstallPlugin,
);

router.get(
    ROUTES.CORE.GET_PLUGIN_DETAILS_BY_ID,
    middlewares.validateSchema({ pathParamSchema: PluginSchema.getPluginDetailByIdSchema }),
    PluginController.getPluginDetailsById,
);

export default router;
