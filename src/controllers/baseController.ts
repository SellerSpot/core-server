import { IResponse } from 'typings/request.types';

export const performHandshake = (): Promise<IResponse> => {
    return Promise.resolve({
        status: true,
        statusCode: 200,
        data: true,
    });
};
