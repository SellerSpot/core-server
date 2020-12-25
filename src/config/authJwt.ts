import { IJwtVerficationPayload, ITokenPayload } from 'typings/request.types';
import jwt from 'jsonwebtoken';
import { CONFIG } from '.';

export const verifyToken = async (token: string): Promise<IJwtVerficationPayload> => {
    try {
        if (!token) {
            throw 'tokenNotFound';
        }
        const response = await new Promise((resolve, reject) =>
            jwt.verify(token, CONFIG.JWT_SECRET, (err, decoded: ITokenPayload) => {
                if (err) {
                    reject('tokenExpired');
                }
                // on verificaiton success
                resolve({
                    status: true,
                    data: decoded,
                });
            }),
        );
        Promise.resolve(response);
    } catch (error) {
        return Promise.reject({
            status: false,
            data: [
                {
                    name: error,
                    message:
                        'Auth token expired or not found! ReAuthenticate to refresh the token.',
                },
            ],
        } as IJwtVerficationPayload);
    }
};
