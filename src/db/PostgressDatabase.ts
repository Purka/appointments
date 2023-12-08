import { Sequelize } from "sequelize/types";
import { ILogger } from "../interfaces/ILogger";
import { SequelizeClient } from "./SequelizeClient";
import { PatientModel } from "../models/PatientModel";
import { DoctorModel } from "../models/DoctorModel";
import { AppointmentModel } from "../models/AppointmentModel";

/**
 * The PostgresDatabase class is responsible for initializing and managing the database connection
 * and models for a PostgreSQL database using Sequelize.
 */
export class PostgresDatabase {
    public constructor(private logger: ILogger, private sequelizeClient: SequelizeClient) {
        this.sequelizeClient = sequelizeClient;
    }

    /**
     * Gets the Sequelize instance.
     * @returns The Sequelize instance used for database operations.
     */
    public get sequelize(): Sequelize {
        return this.sequelizeClient.getSequelize();
    }

    /**
    * Gets the PatientModel.
    * @returns The Sequelize model for Patients.
    */
    public get PatientModel(): typeof PatientModel {
        const model = this.sequelize.models["Patient"];
        return model as typeof PatientModel;
    }

    /**
     * Gets the DoctorModel.
     * @returns The Sequelize model for Doctors.
     */
    public get DoctorModel(): typeof DoctorModel {
        const model = this.sequelize.models["Doctor"];
        return model as typeof DoctorModel;
    }

    /**
     * Gets the AppointmentModel.
     * @returns The Sequelize model for Appointments.
     */
    public get AppointmentModel(): typeof AppointmentModel {
        const model = this.sequelize.models["Appointment"];
        return model as typeof AppointmentModel;
    }

    /**
    * Initializes the database connection and models, and syncs the models with the database.
    * @throws Throws an error if initialization fails.
    */
    public async init(): Promise<void> {
        try {
            await this.connect();
            await this.initModels();
            await this.syncModels();
        } catch (error) {
            this.logger.error("PostgresDatabase::init()", "initialization failed", { error });
            throw error;
        }
    }

    /**
     * Establishes a connection to the PostgreSQL database.
     * @throws Throws an error if the connection fails.
     */
    private async connect(): Promise<void> {
        this.logger.info("PostgresDatabase::connect()", "connecting to database");
        try {
            await this.sequelizeClient.connect(this.logger);
        } catch (error) {
            this.logger.error("PostgresDatabase::connect()", "connecting to database failed", { error });
            throw error;
        }
    }

    /**
    * Initializes Sequelize models.
    */
    public async initModels(): Promise<void> {
        this.logger.info("PostgresDatabase::initModels()", "initializing models");
        PatientModel.Init(this.sequelize);
        DoctorModel.Init(this.sequelize);
        AppointmentModel.Init(this.sequelize);

        DoctorModel.hasMany(AppointmentModel, {
            foreignKey: 'doctorId',
            as: 'appointments'
        });

        PatientModel.hasMany(AppointmentModel, {
            foreignKey: 'patientId',
            as: 'appointments'
        });

        AppointmentModel.belongsTo(PatientModel, {
            foreignKey: 'patientId',
            as: 'patient'
        });

        AppointmentModel.belongsTo(DoctorModel, {
            foreignKey: 'doctorId',
            as: 'doctor'
        });
    }

    /**
     * Synchronizes the models with the database, creating or altering tables as necessary.
     * @throws Throws an error if the synchronization fails.
     */
    private async syncModels(): Promise<void> {
        try {
            this.logger.info("PostgresDatabase::syncModels()", "creating and altering tables");
            await this.sequelize.sync();
        } catch (error) {
            this.logger.error("PostgresDatabase::syncModels()", "creating and altering tables failed", { error });
            throw error;
        }
    }

}