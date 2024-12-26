import { Model } from "sequelize";
export default async (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Url, { foreignKey: "user_id", as: "urls" });
      User.hasMany(models.RateLimit, {
        foreignKey: "user_id",
        as: "rateLimits",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      mobile: { type: DataTypes.STRING },
      google_id: { type: DataTypes.STRING },
      status: { type: DataTypes.ENUM("Active", "Inactive", "Deleted") },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
