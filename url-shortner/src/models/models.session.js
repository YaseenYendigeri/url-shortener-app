import { Model } from "sequelize";
export default async (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      Session.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    }
  }
  Session.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
      user_id: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: "Session",
    }
  );
  return Session;
};
