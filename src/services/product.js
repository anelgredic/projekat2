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

  async getProductById(id, includeCategories = false) {
    let includeOptions;
    if (includeCategories === true) {
      includeOptions = {
        include: { model: this.db.Category, as: "categories" },
      };
    }
    const product = await this.db.Product.findByPk(id, includeOptions);
    return product;
  }

  async deleteProduct(product) {
    await product.destroy();
  }

  async addCategoriesToProduct(categoriesIds, productId) {
    const productCategories = categoriesIds.map((categoryId) => ({
      productId,
      categoryId,
    }));

    await this.db.ProductCategory.bulkCreate(productCategories);
  }
}

module.exports = new Product(db);
