
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { Supplier, Venue } from '../types';
import User from './User';
import Event from './Event';

class SupplierModel extends Model<Supplier> implements Supplier {
  public id!: string;
  public userId!: string;
  public name!: string;
  public category!: string;
  public contact!: string;
  public phone?: string;
  public email?: string;
  public website?: string;
  public address?: string;
  public notes?: string;
}

SupplierModel.init(
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
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    website: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.TEXT
    },
    notes: {
      type: DataTypes.TEXT
    }
  },
  {
    sequelize,
    tableName: 'suppliers',
    timestamps: false,
    indexes: [
      {
        name: 'suppliers_user_id_idx',
        fields: ['userId']
      },
      {
        name: 'suppliers_user_name_idx',
        fields: ['userId', 'name']
      }
    ]
  }
);

class VenueModel extends Model<Venue> implements Venue {
  public id!: string;
  public eventId!: string;
  public name!: string;
  public address!: string;
  public capacity!: number;
  public contact!: string;
  public phone?: string;
  public email?: string;
  public openingHours?: string;
  public latitude?: number;
  public longitude?: number;
}

VenueModel.init(
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
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    openingHours: {
      type: DataTypes.STRING
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8)
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8)
    }
  },
  {
    sequelize,
    tableName: 'venues',
    timestamps: false,
    indexes: [
      {
        name: 'venues_event_id_idx',
        unique: true,
        fields: ['eventId']
      }
    ]
  }
);

SupplierModel.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(SupplierModel, { foreignKey: 'userId' });

VenueModel.belongsTo(Event, { foreignKey: 'eventId' });
Event.hasOne(VenueModel, { foreignKey: 'eventId' });

export { SupplierModel, VenueModel };