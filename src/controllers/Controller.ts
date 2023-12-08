import { RequestHandler, Router } from "express";
import { Route } from "../Route";
import { ILogger } from "../interfaces/ILogger";
import { CustomError } from "../CustomError";

export abstract class Controller {
    protected config: any;

    public constructor(
        public path: string,
        public logger: ILogger,
        public router: Router = Router()
    ) {
        this.logger.debug("Controller::Controller()", "", { path });
    }


    public init(config: any): void {
        this.config = config;
        this.initRoutes();
    }

    public initRoute(route: Route): void {
        this.logger.debug("Controller::initRoute()", "", {
            method: route.method,
            path: route.path,
            basePath: this.path,
        });
        switch (route.method) {
            case "GET":
                this.router.get(route.path, this.prepare(route.handler));
                break;
            case "POST":
                this.router.post(route.path, this.prepare(route.handler));
                break;
            case "DELETE":
                this.router.delete(route.path, this.prepare(route.handler));
                break;
            case "PUT":
                this.router.put(route.path, this.prepare(route.handler));
                break;
            case "PATCH":
                this.router.patch(route.path, this.prepare(route.handler));
                break;
            default:
                throw new CustomError(500, "Method Not Supported", { method: route.method });
        }
    }

    protected abstract initRoutes(): void;

    protected prepare(handler: any): RequestHandler {
        const callback: RequestHandler = async (req: any, res: any, next: any) => {
            if (handler) {
                try {
                    await handler(req, res, next);
                } catch (err) {
                    next(err);
                    return;
                }
            }
        };

        return callback;
    }
}
