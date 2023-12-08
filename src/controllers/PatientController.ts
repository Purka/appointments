import { NextFunction, Request, Response } from 'express';
import { PatientService } from './../services/PatientService';
import { Controller } from './Controller';
import { ILogger } from '../interfaces/ILogger';
import { Route } from '../Route';
import { PatientSchema } from '../validationSchemas/PatientSchema';
import { CustomError } from '../CustomError';

export class PatientController extends Controller {
    constructor(public path: string, logger: ILogger, private patientService: PatientService) {
        super(path, logger);

    }

    public initRoutes(): void {
        this.initRoute(new Route("GET", "/", this.getAllPatients));
        this.initRoute(new Route("GET", "/:id", this.getPatientById));
        this.initRoute(new Route("POST", "/", this.createPatient));
    }

    public getAllPatients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            this.logger.debug("PatientController::getAllPatients()", "Getting all patients");
            const patients = await this.patientService.getAllPatients();
            res.status(200).json(patients);
        } catch (error: any) {
            this.logger.error("PatientController::getAllPatients()", error.message);
            next(error);
        }
    }

    public getPatientById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const patient = await this.patientService.getPatientById(Number(req.params.id));
            res.status(200).json(patient);
        } catch (error: any) {
            this.logger.error("PatientController::getPatientById()", error.message);
            next(error);
        }
    }

    public createPatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const validation = PatientSchema.validate(req.body);

            if (validation.error) {
                throw new CustomError(412, "Precondition Failed", validation.error.details)
            }

            const patient = await this.patientService.createPatient(req.body);

            res.status(200).json(patient);
        } catch (error: any) {
            this.logger.error("PatientController::createPatient()", error.message);
            next(error);
        }
    }
}