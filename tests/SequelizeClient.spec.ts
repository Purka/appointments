import { SequelizeClient } from '../src/db/SequelizeClient';
import { Sequelize, Dialect } from 'sequelize';
import { ILogger } from '../src/interfaces/ILogger';
import * as TypeMoq from 'typemoq';
import { Times, It } from 'typemoq';
import { expect } from 'chai';

describe('SequelizeClient', () => {
    const sequelizeMock = TypeMoq.Mock.ofType<Sequelize>();
    const loggerMock = TypeMoq.Mock.ofType<ILogger>();
    let sequelizeClient: SequelizeClient;

    beforeEach(() => {
        sequelizeClient = new SequelizeClient(loggerMock.object, {}, sequelizeMock.object);
    });

    afterEach(() => {
        sequelizeMock.reset();
        loggerMock.reset();
    });

    describe('constructor', () => {
        it('should initialize a new Sequelize instance', () => {
            expect(sequelizeClient.sequelize).to.equal(sequelizeMock.object);
        });
    });

    describe('getSequelize', () => {
        it('should return the Sequelize instance', () => {
            expect(sequelizeClient.getSequelize()).to.equal(sequelizeMock.object);
        });
    });

    describe('InitSequelize', () => {
        it('should initialize a new Sequelize instance', () => {
            const loggerMock = TypeMoq.Mock.ofType<ILogger>();
            const dialect: Dialect = 'sqlite';
            const sequelize = SequelizeClient.InitSequelize(loggerMock.object, { dialect });

            expect(sequelize).to.be.instanceOf(Sequelize);
        });
    });

    describe('connect', () => {
        it('should establish a connection successfully', async () => {
            sequelizeMock.setup(s => s.authenticate()).returns(() => Promise.resolve());

            await sequelizeClient.connect(loggerMock.object);

            sequelizeMock.verify(s => s.authenticate(), Times.once());
            loggerMock.verify(l => l.info(It.isAnyString(), It.isAny()), Times.once());
        });

        it('should throw an error if the connection fails', async () => {
            const error = new Error('Connection failed');
            sequelizeMock.setup(s => s.authenticate()).returns(() => Promise.reject(error));

            try {
                await sequelizeClient.connect(loggerMock.object);
                expect.fail('Expected error was not thrown');
            } catch (e) {
                expect(e).to.equal(error);
            }

            loggerMock.verify(l => l.error(It.isAnyString(), It.isAnyString(), It.isAny()), Times.once());
        });
    });

    describe('close', () => {
        it('should close the connection successfully', async () => {
            sequelizeMock.setup(s => s.close()).returns(() => Promise.resolve());

            await sequelizeClient.close();

            sequelizeMock.verify(s => s.close(), Times.once());
        });
    });
});
