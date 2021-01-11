import { CONFIG } from 'config/config';
import { MONGOOSE_MODELS } from 'config/mongooseModels';
import { ReservedDomainModel } from 'models';
import { IResponse } from 'typings/request.types';

/* admin interaction controllers */
export const adminAddNewReservedDomain = async (
    data: ReservedDomainModel.IReservedDomain,
): Promise<IResponse> => {
    try {
        if (!(data.name && data.name)) throw 'Invalid Data';
        const db = global.currentDb.useDb(CONFIG.BASE_DB_NAME);

        const ReservedDomainModel: ReservedDomainModel.IReservedDomainModel = db.model(
            MONGOOSE_MODELS.RESERVED_DOMAIN,
        );

        if ((await ReservedDomainModel.find({ name: data.name })).length !== 0)
            throw 'Domain with the Same name already available!';

        const reservedDomain = await ReservedDomainModel.create({
            name: data.name.toLowerCase(),
        });

        return Promise.resolve({
            status: true,
            statusCode: 200,
            data: reservedDomain,
        });
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'reservedDomainAddFailure',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};

// destructive operation - need to handle with care , all the the users app object should be updated and notification should be sent to user , that the pariticular app is being shutting down for so and so reason.
export const deleteReservedDomain = async (domainId: string): Promise<IResponse> => {
    try {
        if (!domainId) throw 'Invalid Data';
        const db = global.currentDb.useDb(CONFIG.BASE_DB_NAME);

        const ReservedDomainModel: ReservedDomainModel.IReservedDomainModel = db.model(
            MONGOOSE_MODELS.RESERVED_DOMAIN,
        );

        await ReservedDomainModel.findByIdAndDelete(domainId);

        return Promise.resolve({
            status: true,
            statusCode: 200,
            data: 'Domain Deleted successfully!',
        });
    } catch (error) {
        return Promise.reject({
            status: false,
            statusCode: 400,
            data: [
                {
                    name: 'reservedDomainDeleteFailure',
                    message: error.message ?? error,
                },
            ],
        } as IResponse);
    }
};
