import { Model } from "sequelize";
export default async (sequelize, DataTypes) => {
  class Analytic extends Model {
    static associate(models) {
      Analytic.belongsTo(models.Url, { foreignKey: "url_id", as: "url" });
    }
  }
  Analytic.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ip_address: { type: DataTypes.STRING },
      user_agent: { type: DataTypes.STRING },
      geo_location: { type: DataTypes.STRING },
      url_id: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: "Analytic",
    }
  );
  return Analytic;
};
