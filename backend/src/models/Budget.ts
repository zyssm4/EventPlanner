import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { BudgetCategory, BudgetItem } from '../../../shared/types';
import Event from './Event';

class BudgetCategoryModel extends Model<BudgetCategory> implements BudgetCategory {
  public id!: string;
  public eventId!: string;
  public name!: string;
  public order!: number;
}

BudgetCategoryModel.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: 'budget_categories',
    timestamps: false,
    indexes: [
      {
        name: 'budget_categories_event_id_idx',
        fields: ['eventId']
      },
      {
        name: 'budget_categories_event_order_idx',
        fields: ['eventId', 'order']
      }
    ]
  }
);

class BudgetItemModel extends Model<BudgetItem> implements BudgetItem {
  public id!: string;
  public categoryId!: string;
  public name!: string;
  public estimatedCost!: number;
  public actualCost!: number;
  public notes?: string;
  public order!: number;
}

BudgetItemModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'budget_categories',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estimatedCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    actualCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    notes: {
      type: DataTypes.TEXT
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: 'budget_items',
    timestamps: false,
    indexes: [
      {
        name: 'budget_items_category_id_idx',
        fields: ['categoryId']
      },
      {
        name: 'budget_items_category_order_idx',
        fields: ['categoryId', 'order']
      }
    ]
  }
);

BudgetCategoryModel.belongsTo(Event, { foreignKey: 'eventId' });
Event.hasMany(BudgetCategoryModel, { foreignKey: 'eventId' });

BudgetItemModel.belongsTo(BudgetCategoryModel, { foreignKey: 'categoryId' });
BudgetCategoryModel.hasMany(BudgetItemModel, { foreignKey: 'categoryId' });

export { BudgetCategoryModel, BudgetItemModel };