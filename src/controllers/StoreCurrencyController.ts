import { RequestHandler } from 'express';
import { StoreCurrencyService } from 'services/services';
import {
    IGetAllStoreCurrenciesResponse,
    IUpdateStoreCurrencyResponse,
    IUpdateStoreCurrencyRequest,
    STATUS_CODE,
} from '@sellerspot/universal-types';

export class StoreCurrencyController {
    static getAllCurrencies: RequestHandler = async (_, res) => {
        const storeCurrencies = await StoreCurrencyService.getAllStoreCurrencies();
        const response: IGetAllStoreCurrenciesResponse = {
            status: true,
            data: storeCurrencies,
        };
        res.status(STATUS_CODE.OK).send(response);
    };

    static updateStoreCurrency: RequestHandler = async (req, res) => {
        const body = <IUpdateStoreCurrencyRequest>req.body;
        const { tenantId } = req.currentUser;
        const updatedStoreCurrency = await StoreCurrencyService.updateStoreCurrency(
            tenantId,
            body.currencyId,
        );
        const response: IUpdateStoreCurrencyResponse = {
            status: true,
            data: updatedStoreCurrency,
        };
        res.status(STATUS_CODE.OK).send(response);
    };
}
