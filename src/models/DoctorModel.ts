import { Sequelize, Model, DataTypes, Optional } from 'sequelize';

interface DoctorAttributes {
    id: number;
    name: string;
    bio: string;
}

interface DoctorCreationAttributes extends Optional<DoctorAttributes, 'id'> { }

export class DoctorModel extends Model<DoctorAttributes, DoctorCreationAttributes> implements DoctorAttributes {
    id!: number;
    name!: string;
    bio!: string;
    public static ModelName = "Doctor";
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
        bio: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }

    public static Init(sequelize: Sequelize): void {
        DoctorModel.init(DoctorModel.Attributes, {
            sequelize,
            modelName: DoctorModel.ModelName,
            paranoid: false
        });
    }
}
