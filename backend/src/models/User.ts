import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { User as IUser, Language } from '../../../shared/types';

class User extends Model<IUser> implements IUser {
  public id!: string;
  public email!: string;
  public password!: string;
  public name!: string;
  public language!: Language;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    language: {
      type: DataTypes.ENUM('en', 'fr', 'de'),
      defaultValue: 'en'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        name: 'users_email_idx',
        unique: true,
        fields: ['email']
      }
    ]
  }
);

export default User;