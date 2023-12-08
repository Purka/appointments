import { expect } from 'chai';
import { IMock, Mock, It, Times } from 'typemoq';
import { ILogger } from '../src/interfaces/ILogger';
import { PatientModel } from '../src/models/PatientModel';
import { PatientService } from '../src/services/PatientService';
import { PostgresDatabase } from '../src/db/PostgressDatabase';
describe('PatientService', () => {
    let mockLogger = Mock.ofType<ILogger>();
    const PatientModelMock = Mock.ofType<typeof PatientModel>();
    const DatabaseMock = Mock.ofType<PostgresDatabase>();
    DatabaseMock.setup(db => db.PatientModel).returns(() => PatientModelMock.object);

    describe('CreatePatient', () => {
        it('should create a new patient when correct data is provided', async () => {
            const patientData = { name: 'John Doe', age: 30 };
            PatientModelMock.setup(db => db.create(It.isAny())).returns(() => Promise.resolve(patientData as any));

            const patientService = new PatientService(mockLogger.object, DatabaseMock.object);
            const result = await patientService.createPatient(patientData);
            console.log("🚀 ~ file: PatientService.spec.ts:29 ~ it.only ~ result:", result)

            expect(result.name).to.equal(patientData.name);
            expect(result.age).to.equal(patientData.age);
            PatientModelMock.verify(db => db.create(patientData), Times.once());
        });

        it('should throw an error when incorrect data is provided', async () => {
            const patientData = { name: 'John Doe' };
            PatientModelMock.setup(db => db.create(It.isAny())).returns(() => Promise.reject("Error creating patient"));

            const patientService = new PatientService(mockLogger.object, DatabaseMock.object);

            let error: any;
            try {
                await patientService.createPatient(patientData);
            } catch (err) {
                error = err;
                console.log("🚀 ~ file: PatientService.spec.ts:37 ~ it ~ error:", error)
            }
            expect(error.code).to.equal(500);
            expect(error.message).to.equal("Error creating patient");
        });
    });

    describe('GetAllPatients', () => {
        it('should get all patients', async () => {
            const patientData = [{ name: 'John Doe', age: 30 }, { name: 'Jane Doe', age: 25 }];

            PatientModelMock.setup(db => db.findAll()).returns(() => Promise.resolve(patientData as any));

            const patientService = new PatientService(mockLogger.object, DatabaseMock.object);
            const result = await patientService.getAllPatients();

            expect(result).to.equal(patientData);
        });

        it('should throw an error when an error occurs', async () => {
            PatientModelMock.setup(db => db.findAll()).returns(() => Promise.reject("Error getting patients"));

            const patientService = new PatientService(mockLogger.object, DatabaseMock.object);

            let error: any;
            try {
                await patientService.getAllPatients();
            } catch (err) {
                error = err;
            }
            expect(error.code).to.equal(500);
            expect(error.message).to.equal("Error getting patients");
        });
    });
});