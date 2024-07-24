const db = require("../database/models/index");
const CategoryModel = db.Category;

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
    //
    return categories;
  }

  async getCategoryById(id) {
    const category = await this.db.Category.findByPk(id);
    if (!category) {
      const error = new Error("Category not found!");
      error.status = 404;
      throw error;
    }
    return category;
  }

  async getCategoriesByIds(categoriesIds) {
    const categories = await CategoryModel.findAll({
      where: { id: categoriesIds },
    });

    if (categories.length !== categoriesIds.length) {
      const error = new Error("Some categories not found!");
      error.status = 404;
      throw error;
    }

    return categories;
  }

  async updateCategory(updates, categoryId) {
    const updateKeys = Object.keys(updates);
    const allowedUpdates = ["name"];
    const isValidOperation = updateKeys.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      const error = new Error("Invalid updates!");
      error.status = 400;
      throw error;
    }
    const category = await this.getCategoryById(categoryId);

    if (!category) {
      const error = new Error("Category not found!");
      error.status = 404;
      throw error;
    }

    updateKeys.forEach((update) => (category[update] = updates[update]));
    return category;
  }

  async deleteCategory(category) {
    if (!category) {
      const error = new Error("Category not found!");
      error.status = 404;
      throw error;
    }
    await category.destroy();
  }
}

module.exports = new Category(db);
