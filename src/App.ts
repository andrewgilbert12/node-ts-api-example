import * as express from 'express';
import * as helmet from 'helmet';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

import shopRouter from './routes/ShopRouter';
import nearestRouter from './routes/NearestRouter';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.setupMiddleware();
        this.setupRoutes();
    }

    private setupMiddleware(): void {
        // security
        this.express.use(helmet());

        // debugging
        this.express.use(logger('dev'));

        // body-parser
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({
            extended: false
        }));
    }

    private setupRoutes(): void {
        this.express.use('/api/v1/shops', shopRouter);
        this.express.use('/api/v1/nearest', nearestRouter);
    }
}

export default new App().express;
