import { RequestHandler } from 'express';
import { StoreCurrencyService } from 'services/services';
import { IGetAllStoreCurrenciesResponse, STATUS_CODE } from '@sellerspot/universal-types';

export class StoreCurrencyController {
    static getAllCurrencies: RequestHandler = async (_, res) => {
        const storeCurrencies = await StoreCurrencyService.getAllStoreCurrencies();
        const response: IGetAllStoreCurrenciesResponse = {
            status: true,
            data: storeCurrencies,
        };
        res.status(STATUS_CODE.OK).send(response);
    };
}
