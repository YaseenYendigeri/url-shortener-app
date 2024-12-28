import { Model } from "sequelize";
export default async (sequelize, DataTypes) => {
  class Url extends Model {
    static associate(models) {
      Url.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Url.hasMany(models.Analytic, { foreignKey: "url_id", as: "analytics" });
    }
  }
  Url.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      long_url: { type: DataTypes.TEXT },
      short_url: { type: DataTypes.STRING },
      custom_alias: { type: DataTypes.STRING },
      topic: { type: DataTypes.STRING },
      status: { type: DataTypes.ENUM("Active", "Expired", "Deleted") },
      expiry_date: { type: DataTypes.DATE },
      user_id: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: "Url",
    }
  );
  return Url;
};
