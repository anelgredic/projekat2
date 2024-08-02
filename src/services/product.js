const db = require("../database/models/index");

class Product {
  constructor(db) {
    this.db = db;
  }

  async createProduct(name, price, description) {
    const newProduct = await this.db.Product.create({
      name,
      price,
      description,
    });

    return newProduct;
  }

  async getAllProducts() {
    const products = await this.db.Product.findAll({
      include: { model: this.db.Category, as: "categories" },
    });
    return products;
  }

  async getProductById(id) {
    const product = await this.db.Product.findByPk(id, {
      include: {
        model: this.db.Category,
        as: "categories",
      },
    });

    if (!product) {
      const error = new Error("Product not found!");
      error.status = 404;
      throw error;
    }
    return product;
  }

  // Dohvatanje kategorija povezanih sa proizvodom
  async getProductCategories(product) {
    const currentCategoryIds = product.categories.map(
      (category) => category.id
    );

    return currentCategoryIds;
  }

  // Provera da li su sve navedene kategorije povezane sa proizvodom
  async areAllCategoriesLinkedToProduct(categoriesIds, currentCategoryIds) {
    const allCategoriesMatch = categoriesIds.every((categoryId) =>
      currentCategoryIds.includes(categoryId)
    );

    if (!allCategoriesMatch) {
      const error = new Error(
        "All specified categories must be currently associated with the product"
      );
      error.status = 400;
      throw error;
    }
  }

  async updateProduct(updates, productId) {
    const updateKeys = Object.keys(updates);
    const allowedUpdates = ["name", "price", "description"];
    const isValidOperation = updateKeys.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      const error = new Error("Invalid updates!");
      error.status = 400;
      throw error;
    }
    const product = await this.getProductById(productId);

    if (!product) {
      const error = new Error("Product not found!");
      error.status = 404;
      throw error;
    }

    updateKeys.forEach((update) => (product[update] = updates[update]));
    return product;
  }

  async deleteProduct(product) {
    if (!product) {
      const error = new Error("Product not found!");
      error.status = 404;
      throw error;
    }

    await product.destroy();
  }

  async addCategoriesToProduct(categoriesIds, productId) {
    const productCategories = categoriesIds.map((categoryId) => ({
      productId,
      categoryId,
    }));

    await this.db.ProductCategory.bulkCreate(productCategories);
  }

  async deleteProductCategory(productId, categoriesIds) {
    await this.db.ProductCategory.destroy({
      where: { productId, categoryId: categoriesIds },
    });
  }
}

module.exports = new Product(db);
