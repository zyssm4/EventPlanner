import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { Event as IEvent, EventType } from '../types';
import User from './User';

class Event extends Model<IEvent> implements IEvent {
  public id!: string;
  public userId!: string;
  public name!: string;
  public type!: EventType;
  public date!: Date;
  public guestCount!: number;
  public description?: string;
  public venueId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('wedding', 'birthday', 'company'),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    guestCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    description: {
      type: DataTypes.TEXT
    },
    venueId: {
      type: DataTypes.UUID
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
    tableName: 'events',
    timestamps: true,
    indexes: [
      {
        name: 'events_user_id_idx',
        fields: ['userId']
      },
      {
        name: 'events_date_idx',
        fields: ['date']
      },
      {
        name: 'events_user_date_idx',
        fields: ['userId', 'date']
      }
    ]
  }
);

Event.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Event, { foreignKey: 'userId' });

export default Event;