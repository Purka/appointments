
import { Application, ErrorRequestHandler, RequestHandler, Request, Response, NextFunction } from "express";
import { Controller } from "./controllers/Controller";
import { IExpressApplicationConfig } from "./interfaces/IExpressApplicationConfig";
import { ILogger } from "./interfaces/ILogger";
import { CustomError } from "./CustomError";

import express, { Express } from 'express';

/**
 * The ExpressApplication class encapsulates the setup and configuration of an Express application.
 */
export class ExpressApplication {
    private app: Application;

    /**
     * Creates an instance of ExpressApplication.
     * @param appConfig Configuration for the Express application.
     * @param logger Logger service for logging messages.
     */
    constructor(private appConfig: IExpressApplicationConfig, private logger: ILogger) {
        this.app = express();
        this.initMiddlewares(appConfig.middlewares || []);
        this.initRoutes(appConfig.controllers || []);
        this.setErrorHandler(this.defaultErrorHandler);
    }

    /**
     * Starts the Express application on the configured port.
     */
    public listen(): void {
        this.logger.info("ExpressApplication::listen()", "", {
            port: this.appConfig.config.port,
            version: this.appConfig.config.version,
        });

        this.app.listen(this.appConfig.config.port, () => {
            this.logger.info("ExpressApplication::HttpsServer::listen()", "", {
                port: this.appConfig.config.port,
                version: this.appConfig.config.version,
            });
        });
    }

    /**
    * Initializes global middlewares for the application.
    * @param middlewares Array of middleware functions.
    */
    private initMiddlewares(middlewares: RequestHandler[]) {
        this.logger.debug("ExpressApplication::middlewares()");

        middlewares.forEach((middleware) => {
            this.app.use(middleware);
        });
    }

    /**
     * Initializes routes from the provided controllers.
     * @param controllers Array of controller instances.
     */
    private initRoutes(controllers: Controller[]) {
        this.logger.debug("ExpressApplication::routes()");

        controllers.forEach((controller) => {
            controller.init(this.appConfig.config);
            this.app.use(controller.path, controller.router);
        });
    }

    /**
     * Sets a custom error handler for the application.
     * @param errorHandler Custom error handling function.
     */
    private setErrorHandler(errorHandler: ErrorRequestHandler) {
        this.logger.debug("ExpressApplication::setErrorHandler()");

        if (errorHandler) {
            this.app.use(errorHandler);
        }
    }

    private defaultErrorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
        this.logger.error("ExpressApplication::ErrorHandler()", "", {
            error: err,
            stack: err.stack,
        });
        const status = err.code ?? 500;
        const message = err.message ?? "Unknown Internal Server Error";
        const details = err.details ?? null;

        res.statusMessage = message;
        res.status(status);

        if (details) {
            res.json({ details })
        } else {
            res.end()
        }
    };
}
