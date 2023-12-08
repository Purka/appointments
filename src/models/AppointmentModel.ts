import { Sequelize, Model, DataTypes, Optional } from 'sequelize';

interface AppointmentAttributes {
    id: number;
    doctorId: number;
    patientId: number;
    startTime: Date;
    endTime: Date;
}

interface AppointmentCreationAttributes extends Optional<AppointmentAttributes, 'id'> { }

export class AppointmentModel extends Model<AppointmentAttributes, AppointmentCreationAttributes> implements AppointmentAttributes {
    id!: number;
    doctorId!: number;
    patientId!: number;
    date!: Date;
    startTime!: Date;
    endTime!: Date;
    public static ModelName = "Appointment";
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static Attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        doctorId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        patientId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }

    public static Init(sequelize: Sequelize): void {
        AppointmentModel.init(AppointmentModel.Attributes, {
            sequelize,
            modelName: AppointmentModel.ModelName,
            paranoid: false
        });
    }
}
