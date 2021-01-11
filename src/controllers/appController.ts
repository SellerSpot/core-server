import { CONFIG } from 'config/config';
import { MONGOOSE_MODELS } from 'config/mongooseModels';
import { AppModel, TenantModel } from 'models';
import { IResponse } from 'typings/request.types';
import { IApp } from 'models/App';
import lodash from 'lodash';
import mongoose, { Document } from 'mongoose';

/* tenant interaction controllers */

// get all available apps
/**
 * maybe pagination in future
 */
export const getAllApps = async (): Promise<IResponse> => {
    try {
        const db = global.currentDb.useDb(CONFIG.BASE_DB_NAME);

        const AppModel: AppModel.IAppModel = db.model(MONGOOSE_MODELS.APP);

        const apps = await AppModel.find({});

        return Promise.resolve({
            status: true,
            statusCode: 200,
            data: apps,
        });
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'allAppsGetFailure',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};

// get app by id / also by slug name
export const getAppByIdOrSlug = async (idOrSlug: string, isSlug = false): Promise<IResponse> => {
    try {
        const db = global.currentDb.useDb(CONFIG.BASE_DB_NAME);

        const AppModel: AppModel.IAppModel = db.model(MONGOOSE_MODELS.APP);

        let app: Document;
        if (isSlug) {
            app = await AppModel.findOne({ slug: idOrSlug });
        } else {
            app = await AppModel.findById(idOrSlug);
        }
        if (!app) throw 'requested app not found!';

        return Promise.resolve({
            status: true,
            statusCode: 200,
            data: app,
        });
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'allAppsGetFailure',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};

// get tenant installed app by id
// get app by id
export const getTenantInstalledAppByIdOrSlug = async (
    {
        appIdOrSlug,
        tenantId,
    }: {
        appIdOrSlug: string;
        tenantId: string;
    },
    isSlug = false,
): Promise<IResponse> => {
    try {
        if (!appIdOrSlug || !tenantId)
            throw 'Ivalid request body! appIdOrSlug and tenantid needed!';

        const db = global.currentDb.useDb(CONFIG.BASE_DB_NAME);

        const TenantModel: TenantModel.ITenantModel = db.model(MONGOOSE_MODELS.TENANT);

        // const AppModel: AppModel.IAppModel = db.model(MONGOOSE_MODELS.APP);

        const tenant = await TenantModel.findById(tenantId).populate(
            'apps',
            null,
            MONGOOSE_MODELS.APP,
        );

        if (!tenant) throw 'requested tenant not found!';

        if (!tenant.apps) throw 'No apps installed';

        const tenantInstalledApps = tenant.apps as IApp[];

        const findIndexQuery = !isSlug
            ? {
                  _id: mongoose.Types.ObjectId(appIdOrSlug),
              }
            : {
                  slug: appIdOrSlug.toString(),
              };

        const requestedAppIndex = lodash.findIndex(tenantInstalledApps, findIndexQuery);

        if (requestedAppIndex < 0) throw 'Requested App not installed!';

        const requestedApp = tenantInstalledApps[requestedAppIndex];

        return Promise.resolve({
            status: true,
            statusCode: 200,
            data: requestedApp,
        });
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'tenantInstalledAppGetByIdOrSlugFailure',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};

// get tenant installed apps
export const getTenantInstalledApps = async (data: { tenantId: string }): Promise<IResponse> => {
    try {
        const db = global.currentDb.useDb(CONFIG.BASE_DB_NAME);

        const TenantModel: TenantModel.ITenantModel = db.model(MONGOOSE_MODELS.TENANT);
        const tenant = await TenantModel.findById(data.tenantId).populate(
            'apps',
            null,
            MONGOOSE_MODELS.APP,
        );
        if (!tenant) throw 'Not found the requested Tenant!';

        return Promise.resolve({
            status: true,
            statusCode: 200,
            data: tenant.apps,
        });
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'installedAppGetFailure',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};

// install app
export const installApp = async (data: { appId: string; tenantId: string }): Promise<IResponse> => {
    try {
        const { appId, tenantId } = data;
        if (!(appId && tenantId)) throw 'Invalid Data';

        const db = global.currentDb.useDb(CONFIG.BASE_DB_NAME);

        const AppModel: AppModel.IAppModel = db.model(MONGOOSE_MODELS.APP);
        const app = await AppModel.findById(appId);
        if (!app)
            throw 'App you are looking for is currently not available, contact support for more details';

        const TenantModel: TenantModel.ITenantModel = db.model(MONGOOSE_MODELS.TENANT);
        const tenant = await TenantModel.findById(tenantId);
        if (!tenant) throw 'Not found the requested Tenant!';

        if (tenant.apps.includes(app.id)) throw 'App already installed!';

        tenant.apps.push(app.id); // installing app

        await tenant.save();

        // in future we need to move it to many to one relation (every app will contain collection, each entry will be installed as instace entry, which prevents the users's document to exceeds 36mb )
        return await getTenantInstalledApps({ tenantId });
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'appInstallationFailure',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};

export const unInstallApp = async (data: {
    appId: string;
    tenantId: string;
}): Promise<IResponse> => {
    try {
        const { appId, tenantId } = data;
        if (!(appId && tenantId)) throw 'Invalid Data';
        const db = global.currentDb.useDb(CONFIG.BASE_DB_NAME);

        // const AppModel: AppModel.IAppModel = db.model(MONGOOSE_MODELS.APP); // fallback no check the app exisiting in app model
        // const app = await AppModel.findById(appId);
        // if (!app)
        //     throw 'App you are looking for is currently not available, contact support for more details';

        const TenantModel: TenantModel.ITenantModel = db.model(MONGOOSE_MODELS.TENANT);
        const tenant = await TenantModel.findById(tenantId);
        if (!tenant) throw 'Not found the requested Tenant!';
        const appIndex = tenant.apps.indexOf(appId);
        if (appIndex !== -1) {
            tenant.apps.splice(appIndex, 1); // uninstalling app
        }
        await tenant.save();

        // in future we need to move it to many to one relation (every app will contain collection, each entry will be installed as instace entry, which prevents the users's document to exceeds 36mb )

        return await getTenantInstalledApps({ tenantId });
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'appUninstallFailure',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};

/* admin interaction controllers */
export const adminCreateNewApp = async (data: IApp): Promise<IResponse> => {
    try {
        if (!(data.name && data.iconUrl)) throw 'Invalid Data';
        const db = global.currentDb.useDb(CONFIG.BASE_DB_NAME);

        const AppModel: AppModel.IAppModel = db.model(MONGOOSE_MODELS.APP);

        if ((await AppModel.find({ name: data.name })).length !== 0)
            throw 'App with the Same name already available!';

        // creating slug for url tracing (readability)
        data.slug = data.name.toLowerCase().split(' ').join('-');

        const app = await AppModel.create({
            ...data,
        });

        return Promise.resolve({
            status: true,
            statusCode: 200,
            data: app,
        });
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'adminAppCreateFailure',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};

// destructive operation - need to handle with care , all the the users app object should be updated and notification should be sent to user , that the pariticular app is being shutting down for so and so reason.
export const adminDeleteApp = async (appId: string): Promise<IResponse> => {
    try {
        if (!appId) throw 'Invalid Data';
        const db = global.currentDb.useDb(CONFIG.BASE_DB_NAME);

        const AppModel: AppModel.IAppModel = db.model(MONGOOSE_MODELS.APP);

        await AppModel.findByIdAndDelete(appId);

        return Promise.resolve({
            status: true,
            statusCode: 200,
            data: 'Application deleted successfully!',
        });
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'adminAppDeleteFailure',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};
