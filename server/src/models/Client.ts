import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ClientAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  registeredAt: string;
  programIds: string[];
}

interface ClientCreationAttributes extends Optional<ClientAttributes, 'id' | 'registeredAt' | 'programIds'> {}

class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public dateOfBirth!: string;
  public registeredAt!: string;
  public programIds!: string[];
}

Client.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    dateOfBirth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registeredAt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    programIds: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'Client',
    tableName: 'clients',
  }
);

export default Client;