import { Sequelize, Options } from 'sequelize';
import { ILogger } from '../interfaces/ILogger';
import * as _ from 'lodash';

/**
 * The SequelizeClient class encapsulates the setup and management of a Sequelize connection.
 */
export class SequelizeClient {
    /**
     * Initializes a new Sequelize instance.
     * @param logger ILogger instance for logging purposes.
     * @param options Configuration options for Sequelize.
     * @returns A Sequelize instance.
     */
    public static InitSequelize(logger: ILogger, options: Options): Sequelize {
        logger.debug("SequelizeClient::InitSequelize", "initializing sequelize", { options: _.omit(options, ["password"]) });
        return new Sequelize(options);
    }

    /**
     * Creates an instance of SequelizeClient.
     * @param logger ILogger instance for logging database interactions.
     * @param options Configuration options for the Sequelize instance.
     * @param sequelize An optional Sequelize instance. If not provided, one is created using the provided options.
     */
    public constructor(
        protected logger: ILogger,
        protected options: Options,
        public sequelize: Sequelize = SequelizeClient.InitSequelize(logger, options)
    ) { }

    /**
     * Establishes a connection to the database using the Sequelize instance.
     * @param logger The logger instance used for logging connection status and errors.
     * @throws Error if unable to connect to the database.
     */
    public async connect(logger: ILogger): Promise<void> {
        try {
            await this.sequelize.authenticate();
            logger.info('SequelizeClient::connect()', 'Connection has been established successfully.');
        } catch (error) {
            logger.error('SequelizeClient::connect()', 'Unable to connect to the database:', error);
            throw error;
        }
    }

    /**
     * Closes the Sequelize connection.
     * @throws Error if there is an issue closing the connection.
     */
    public async close(): Promise<void> {
        await this.sequelize.close();
    }

    /**
     * Retrieves the Sequelize instance.
     * @returns The Sequelize instance used for database operations.
     */
    public getSequelize(): Sequelize {
        return this.sequelize;
    }
}
