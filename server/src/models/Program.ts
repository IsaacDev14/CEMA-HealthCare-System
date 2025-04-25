import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ProgramAttributes {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface ProgramCreationAttributes extends Optional<ProgramAttributes, 'id' | 'createdAt'> {}

class Program extends Model<ProgramAttributes, ProgramCreationAttributes> implements ProgramAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public createdAt!: string;
}

Program.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allow5
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Program',
    tableName: 'programs',
  }
);

export default Program;