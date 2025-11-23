
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { ChecklistItem } from '../../../shared/types';
import Event from './Event';

class ChecklistItemModel extends Model<ChecklistItem> implements ChecklistItem {
  public id!: string;
  public eventId!: string;
  public title!: string;
  public description?: string;
  public completed!: boolean;
  public dueDate?: Date;
  public order!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ChecklistItemModel.init(
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
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    dueDate: {
      type: DataTypes.DATE
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    tableName: 'checklist_items',
    timestamps: true,
    indexes: [
      {
        name: 'checklist_items_event_id_idx',
        fields: ['eventId']
      },
      {
        name: 'checklist_items_event_order_idx',
        fields: ['eventId', 'order']
      },
      {
        name: 'checklist_items_due_date_idx',
        fields: ['dueDate']
      }
    ]
  }
);

ChecklistItemModel.belongsTo(Event, { foreignKey: 'eventId' });
Event.hasMany(ChecklistItemModel, { foreignKey: 'eventId' });

export default ChecklistItemModel;