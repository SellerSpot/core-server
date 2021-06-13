import { RequestHandler } from 'express';
import { PluginService } from 'services/services';
import {
    IGetAllPluginsResponse,
    IInstallPluginRequest,
    IInstallPluginResponse,
    STATUS_CODE,
} from '@sellerspot/universal-types';

export default class PluginController {
    static getAllPlugins: RequestHandler = async (_, res) => {
        const plugins = await PluginService.getAllPlugins();
        const response: IGetAllPluginsResponse = {
            status: true,
            data: plugins,
        };

        res.status(STATUS_CODE.OK).send(response);
    };

    static installPlugin: RequestHandler = async (req, res) => {
        const installedPlugin: IInstallPluginRequest = req.body;
        const installedPlugins = await PluginService.installPlugin(
            req.currentUser.tenantId,
            installedPlugin.pluginId,
        );
        const response: IInstallPluginResponse = {
            status: true,
            data: installedPlugins,
        };

        res.status(STATUS_CODE.OK).send(response);
    };
}
