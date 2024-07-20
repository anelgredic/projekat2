"use-strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {}

  ProductCategory.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Products",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Categories",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      tableName: "ProductCategory",
      modelName: "ProductCategory",
    }
  );

  return ProductCategory;
};
