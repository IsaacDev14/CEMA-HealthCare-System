import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface SuggestionAttributes {
  id: string;
  title: string;
  description: string;
  category: string;
  dateSubmitted: string;
}

interface SuggestionCreationAttributes extends Optional<SuggestionAttributes, 'id' | 'dateSubmitted'> {}

class Suggestion extends Model<SuggestionAttributes, SuggestionCreationAttributes> implements SuggestionAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public category!: string;
  public dateSubmitted!: string;
}

Suggestion.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateSubmitted: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Suggestion',
    tableName: 'suggestions',
  }
);

export default Suggestion;