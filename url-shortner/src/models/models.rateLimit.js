import { Model } from "sequelize";
export default async (sequelize, DataTypes) => {
  class RateLimit extends Model {
    static associate(models) {
      RateLimit.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    }
  }
  RateLimit.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      endpoint: { type: DataTypes.STRING },
      window_start: { type: DataTypes.DATE },
      request_count: { type: DataTypes.INTEGER },
      user_id: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: "RateLimit",
    }
  );
  return RateLimit;
};
