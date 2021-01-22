import { MONGOOSE_MODELS } from 'models/mongooseModels';
import { appDbModels, baseDbModels, DB_NAMES, tenantDbModels } from 'models';
import { IResponse } from 'typings/request.types';
import lodash from 'lodash';
import mongoose, { Document } from 'mongoose';
import { logger } from 'utilities/logger';
/* tenant interaction controllers */

// get all apps
export const getAllApps = async (): Promise<IResponse> => {
    try {
        const baseDb = global.currentDb.useDb(DB_NAMES.BASE_DB);

        const AppModel: baseDbModels.AppModel.IAppModel = baseDb.model(MONGOOSE_MODELS.BASE_DB.APP);

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

// get an app by id / also by slug name
export const getAppByIdOrSlug = async (idOrSlug: string, isSlug = false): Promise<IResponse> => {
    try {
        const baseDb = global.currentDb.useDb(DB_NAMES.BASE_DB);

        const AppModel: baseDbModels.AppModel.IAppModel = baseDb.model(MONGOOSE_MODELS.BASE_DB.APP);

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
                    name: 'appGetFailure',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};

// tenant install app = till here
export const installApp = async (data: { appId: string; tenantId: string }): Promise<IResponse> => {
    try {
        const { appId, tenantId } = data;
        if (!(appId && tenantId)) throw 'Invalid Data';

        const baseDb = global.currentDb.useDb(DB_NAMES.BASE_DB);

        const AppModel: baseDbModels.AppModel.IAppModel = baseDb.model(MONGOOSE_MODELS.BASE_DB.APP);
        const app = await AppModel.findById(appId);
        if (!app)
            throw 'App you are looking for is currently not available, contact support for more details';

        // create on base db tenant model
        const TenantModel: baseDbModels.TenantModel.ITenantModel = baseDb.model(
            MONGOOSE_MODELS.BASE_DB.TENANT,
        );
        const tenant = await TenantModel.findById(tenantId);
        if (!tenant) throw 'Not found the requested Tenant!';
        if ((<string[]>tenant.apps).includes(app.id))
            throw 'App already installed or currently installing!';
        (<string[]>tenant.apps).push(app.id); // installing app
        await tenant.save();

        // create on tenant db installed app model
        const tenantDb = global.currentDb.useDb(tenantId);
        const InstalledAppsModel: tenantDbModels.InstalledAppModel.IInstalledAppModel = tenantDb.model(
            MONGOOSE_MODELS.TENANT_DB.INSTAllED_APP,
        );
        // no need to check before create here , hence check in basedb tenantModel, earlier, if needed we'll do validation here later.
        await InstalledAppsModel.create({
            app: app.id,
        });

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

// tenant uninstall app
export const unInstallApp = async (data: {
    appId: string;
    tenantId: string;
}): Promise<IResponse> => {
    try {
        const { appId, tenantId } = data;
        if (!(appId && tenantId)) throw 'Invalid Data';

        // delete on basedb tenant model app array
        const baseDb = global.currentDb.useDb(DB_NAMES.BASE_DB);
        const TenantModel: baseDbModels.TenantModel.ITenantModel = baseDb.model(
            MONGOOSE_MODELS.BASE_DB.TENANT,
        );
        const tenant = await TenantModel.findById(tenantId);
        if (!tenant) throw 'Not found the requested Tenant!';
        const appIndex = (<string[]>tenant.apps).indexOf(appId);
        if (appIndex !== -1) {
            tenant.apps.splice(appIndex, 1); // uninstalling app
        } // may need to throw error on else
        await tenant.save();

        // delete on tenant db installedApps colleection
        const tenantDb = global.currentDb.useDb(tenantId);
        const InstalledAppsModel: tenantDbModels.InstalledAppModel.IInstalledAppModel = tenantDb.model(
            MONGOOSE_MODELS.TENANT_DB.INSTAllED_APP,
        );
        await InstalledAppsModel.findOneAndDelete({ app: appId });

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

// get a tenant installed app by id
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

        const baseDb = global.currentDb.useDb(DB_NAMES.BASE_DB);

        const TenantModel: baseDbModels.TenantModel.ITenantModel = baseDb.model(
            MONGOOSE_MODELS.BASE_DB.TENANT,
        );

        const tenant = await TenantModel.findById(tenantId).populate(
            'apps',
            null,
            MONGOOSE_MODELS.BASE_DB.APP,
        );

        if (!tenant) throw 'requested tenant not found!';

        if (!tenant.apps) throw 'No apps installed';

        const tenantInstalledApps = tenant.apps as baseDbModels.AppModel.IApp[];

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

        // taking app model reference from baseDb for population purpose
        const AppModel: baseDbModels.AppModel.IAppModel = baseDb.model(MONGOOSE_MODELS.BASE_DB.APP);

        // getting installed apps from tenant db => we could send additional info about installed app (like expiry, feature allowed, bla bla..) from tenant db installed Apps model, hence we don't directly send requestedApp to client.
        const tenantDb = global.currentDb.useDb(tenantId);
        const InstalledAppModel: tenantDbModels.InstalledAppModel.IInstalledAppModel = tenantDb.model(
            MONGOOSE_MODELS.TENANT_DB.INSTAllED_APP,
        );
        const installedApp = await InstalledAppModel.findOne({
            app: requestedApp._id.toString(),
        }).populate('app', 'app', AppModel); // sending only app property from installedApp model for now, will pivot it later based on requirement
        if (!installedApp) throw 'Requested App not installed!';

        return Promise.resolve({
            status: true,
            statusCode: 200,
            data: installedApp,
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

// get all tenant installed apps
export const getTenantInstalledApps = async (data: { tenantId: string }): Promise<IResponse> => {
    try {
        const db = global.currentDb.useDb(DB_NAMES.BASE_DB);

        const TenantModel: baseDbModels.TenantModel.ITenantModel = db.model(
            MONGOOSE_MODELS.BASE_DB.TENANT,
        );
        const tenant = await TenantModel.findById(data.tenantId).populate(
            'apps',
            null,
            MONGOOSE_MODELS.BASE_DB.APP,
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

// admin interaction controllers
export const adminCreateNewApp = async (data: baseDbModels.AppModel.IApp): Promise<IResponse> => {
    /**
     * Data flow
     * 1. validate new app
     * 2. create slugName and databaseName !important
     * 3. create app on basedb => appCollection
     * 4. create db for app and push the detail handshake collection into it
     */
    try {
        // validation block
        if (!(data.name && data.iconUrl)) throw 'Invalid Data';
        const appName = data.name.trim();
        const baseDb = global.currentDb.useDb(DB_NAMES.BASE_DB);

        // choosing app model from base db
        const AppModel: baseDbModels.AppModel.IAppModel = baseDb.model(MONGOOSE_MODELS.BASE_DB.APP);

        if ((await AppModel.find({ name: appName })).length !== 0)
            throw 'App with the Same name already available!';

        // data creation block
        // creating slug for url tracing (readability)
        data.slug = appName.toLowerCase().split(' ').join('-');
        const appDatabaseName = appName.toUpperCase().split(' ');
        appDatabaseName.push(...['APP', 'DB']);
        data.dbName = appDatabaseName.join('_'); // it will give database names like POINT_OF_SALE_APP_DB

        // create app on basedb => appCollection
        // db ref is alreay on base_db => no need to switch
        const app = await AppModel.create({
            ...data,
        });

        //  create db for app and push the detail handshake collection into it
        // switching db to new app databaseName
        const appDb = global.currentDb.useDb(app.dbName); // the same db name should be in the dbName.ts under models.

        // choosing detail model from current app's db
        const DetailModel: appDbModels.DetailModel.IDetailModel = appDb.model(
            MONGOOSE_MODELS.APP_DB.DETAIL,
        );
        const appDetail = await DetailModel.create({
            app: app.id,
        });

        // checking cross db population
        const appDetails = await DetailModel.findById(appDetail.id).populate('app', null, AppModel); // keep an eye on third param, here AppModel instance is passed, instead name.

        return Promise.resolve({
            status: true,
            statusCode: 200,
            data: appDetails,
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
        const baseDb = global.currentDb.useDb(DB_NAMES.BASE_DB);

        const AppModel: baseDbModels.AppModel.IAppModel = baseDb.model(MONGOOSE_MODELS.BASE_DB.APP);

        const app = await AppModel.findById(appId);

        const appDatabaseName = app.dbName;

        // deletes tenant
        await app.delete();

        logger.mongoose('Deleted database', appDatabaseName);

        global.currentDb.useDb(null); // fail safe - not to delete base db

        // deletes tenant db
        const appDb = global.currentDb.useDb(appDatabaseName.toString()); // id comes and mongoose id to converted to  string
        await appDb.dropDatabase();

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
