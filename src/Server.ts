import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import { config } from "./config/config";
import { PatientController } from "./controllers/PatientController";
import { PostgresDatabase } from "./db/PostgressDatabase";
import { ILogger } from "./interfaces/ILogger";
import { PatientService } from "./services/PatientService";
import { ExpressApplication } from "./ExpressApplication";
import { SequelizeClient } from "./db/SequelizeClient";
import { Controller } from "./controllers/Controller";
import _ from "lodash";
import { HealthCheckController } from "./controllers/HealthCheckController";

/**
 * The Server class encapsulates the setup and management of the Express application and its associated services.
 */
export class Server {
    private controllers: Controller[];
    private app: ExpressApplication;
    private middlewares: any[];

    /**
     * Initializes the database with the provided configuration.
     * @param logger The ILogger instance for logging.
     * @returns An initialized PostgresDatabase instance.
     */
    private static InitDB(logger: ILogger) {
        const sequelizeOptions = config.database;
        const sequelizeClient = new SequelizeClient(logger, sequelizeOptions);
        const db = new PostgresDatabase(logger, sequelizeClient);

        db.init();

        return db;
    }

    /**
     * Constructs an instance of the Server class.
     * @param logger The ILogger instance for logging.
     * @param database (Optional) The PostgresDatabase instance. If not provided, a new instance is initialized.
     */
    constructor(
        public logger: ILogger,
        private database: PostgresDatabase = Server.InitDB(logger),
    ) {
        this.controllers = [
            new PatientController('/patient', this.logger, new PatientService(this.logger, this.database)),
            new HealthCheckController('/health', this.logger)
        ];

        this.middlewares = [
            cookieParser(),
            bodyParser.json(),
            bodyParser.urlencoded({ extended: true }),
            cors()
        ];

        this.app = new ExpressApplication({
            config: config,
            controllers: this.controllers,
            middlewares: this.middlewares
        }, this.logger);
    }

    /**
     * Starts the server after initializing the database and setting up the Express application.
     * @throws Throws an error if the database initialization fails.
     */
    public async start(): Promise<void> {
        this.logger.debug("Server::start()");
        try {
            await this.database.init();
            this.app.listen();
        } catch (error) {
            this.logger.error("Server::start()", "database init error", { error });
            throw error;
        }
    }
}