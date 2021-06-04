import 'typings/';
import 'express-async-errors';
import expresss from 'express';
import {
    logger,
    middlewares,
    applyGracefullShutDownHandler,
    CLSService,
} from '@sellerspot/universal-functions';

import { configureDB } from 'configs/databaseConfig';
import { CONFIG } from 'configs/config';
import { rootRouter } from 'routers/router';

// globals
const app = expresss();

// db configurations
configureDB();

//common middlewares applied
middlewares.applyCommon(app);

// router setup
app.use('/', rootRouter);

app.use(CLSService.clearScope);

// error handler
app.use(middlewares.errorHandler);

// listeners
const server = app.listen(CONFIG.PORT, () =>
    logger.info(`SellerSpot Core Server started on PORT ${CONFIG.PORT}`),
);

// helps to gracefully shutdown the server
applyGracefullShutDownHandler(server);
