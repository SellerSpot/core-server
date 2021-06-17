import { RequestHandler } from 'express';
import { PluginService } from 'services/services';
import {
    IGetAllPluginsResponse,
    IGetPluginDetailByIdRequest,
    IGetPluginDetailsByIdResponse,
    IInstallPluginRequest,
    IInstallPluginResponse,
    IUnInstallPluginRequest,
    IUnInstallPluginResponse,
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
        const requestBody = req.params as unknown as IInstallPluginRequest;
        const installedPlugins = await PluginService.installPlugin(
            req.currentUser.tenantId,
            requestBody.id,
        );
        const response: IInstallPluginResponse = {
            status: true,
            data: installedPlugins,
        };

        res.status(STATUS_CODE.OK).send(response);
    };

    static unInstallPlugin: RequestHandler = async (req, res) => {
        const reqParams = req.params as unknown as IUnInstallPluginRequest;
        const installedPlugins = await PluginService.unInstallPlugin(
            req.currentUser.tenantId,
            reqParams.id,
        );
        const response: IUnInstallPluginResponse = {
            status: true,
            data: installedPlugins,
        };

        res.status(STATUS_CODE.OK).send(response);
    };

    static getPluginDetailsById: RequestHandler = async (req, res) => {
        const params = req.params as unknown as IGetPluginDetailByIdRequest;
        const pluginDetails = await PluginService.getPluginDetailsById(params.id);
        const response: IGetPluginDetailsByIdResponse = {
            status: true,
            data: pluginDetails,
        };
        res.status(STATUS_CODE.OK).send(response);
    };
}
