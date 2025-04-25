import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface FeedbackAttributes {
  id: string;
  title: string;
  description: string;
  rating: number;
  category: string;
  dateSubmitted: string;
}

interface FeedbackCreationAttributes extends Optional<FeedbackAttributes, 'id' | 'dateSubmitted'> {}

class Feedback extends Model<FeedbackAttributes, FeedbackCreationAttributes> implements FeedbackAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public rating!: number;
  public category!: string;
  public dateSubmitted!: string;
}

Feedback.init(
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
    rating: {
      type: DataTypes.INTEGER,
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
    modelName: 'Feedback',
    tableName: 'feedback',
  }
);

export default Feedback;