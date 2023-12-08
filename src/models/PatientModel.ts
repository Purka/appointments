import { Sequelize, Model, DataTypes, Optional } from 'sequelize';

interface PatientAttributes {
    id: number;
    name: string;
    age: number;
}

interface PatientCreationAttributes extends Optional<PatientAttributes, 'id'> { }

export class PatientModel extends Model<PatientAttributes, PatientCreationAttributes> implements PatientAttributes {
    id!: number;
    name!: string;
    age!: number;
    public static ModelName = "Patient";
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static Attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }

    public static Init(sequelize: Sequelize): any {
        return PatientModel.init(PatientModel.Attributes, {
            sequelize,
            modelName: PatientModel.ModelName,
            paranoid: false
        });
    }
}

