
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { TimelineEntry } from '../types';
import Event from './Event';

class TimelineEntryModel extends Model<TimelineEntry> implements TimelineEntry {
  public id!: string;
  public eventId!: string;
  public title!: string;
  public description?: string;
  public startTime!: Date;
  public endTime?: Date;
  public responsiblePerson?: string;
  public order!: number;
}

TimelineEntryModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE
    },
    responsiblePerson: {
      type: DataTypes.STRING
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: 'timeline_entries',
    timestamps: false
  }
);

TimelineEntryModel.belongsTo(Event, { foreignKey: 'eventId', onDelete: 'CASCADE' });
Event.hasMany(TimelineEntryModel, { foreignKey: 'eventId', onDelete: 'CASCADE' });

export default TimelineEntryModel;