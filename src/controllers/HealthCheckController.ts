import { Route } from "../Route";
import { ILogger } from "../interfaces/ILogger";
import { Controller } from "./Controller";
import { Request, Response } from 'express';

export class HealthCheckController extends Controller {
    constructor(public path: string, public logger: ILogger) {
        super(path, logger);

    }

    public initRoutes(): void {
        this.initRoute(new Route("GET", "/", this.healthCheck));
    }

    public healthCheck = (req: Request, res: Response) => {
        this.logger.debug("HealthCheckController::healthCheck()", "Health check OK");
        res.status(200).json({ status: "OK" });
    }
}
