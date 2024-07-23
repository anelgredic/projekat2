const db = require("../database/models/index");

class Category {
  constructor(db) {
    this.db = db;
  }

  async createCategory(name) {
    const newCategory = await this.db.Category.create({ name });
    return newCategory;
  }

  async getAllCategories() {
    const categories = await this.db.Category.findAll();

    return categories;
  }

  async getCategoryById(id) {
    const category = await this.db.Category.findByPk(id);
    return category;
  }

  async deleteCategory(category) {
    await category.destroy();
  }
}

module.exports = new Category(db);
