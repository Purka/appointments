import { CustomError } from '../CustomError';
import { PostgresDatabase } from '../db/PostgressDatabase';
import { ILogger } from '../interfaces/ILogger';
import { PatientModel } from '../models/PatientModel';

export class PatientService {
    public constructor(public logger: ILogger, private database: PostgresDatabase) {
        this.database = database;
    }
    /**
     * Creates a new patient.
     * @param patientData Data for the new patient.
     * @returns The created patient.
     */
    public async createPatient(patientData: any): Promise<PatientModel> {
        try {
            const patient = await this.database.PatientModel.create(patientData);
            return patient;
        } catch (error) {
            this.logger.error("PatientService::createPatient()", "Error creating patient", error);
            throw new CustomError(500, "Error creating patient", error)
        }
    }

    /**
     * Gets all patients.
     * @returns All patients.
     */
    public async getAllPatients(): Promise<PatientModel[]> {
        try {
            const patients = await this.database.PatientModel.findAll();
            return patients;
        } catch (error) {
            throw new CustomError(500, "Error getting patients", error)
        }
    }

    /**
     * Gets a patient by ID.
     * @param id ID of the patient to get.
     * @returns The patient with the specified ID.
     */

    public async getPatientById(id: number): Promise<PatientModel | null> {
        try {
            const patient = await this.database.PatientModel.findByPk(id);
            return patient;
        } catch (error) {
            this.logger.error("PatientService::getPatientById()", "Error getting patient", error);
            throw new CustomError(500, "Error getting patient", error)
        }
    }
}

