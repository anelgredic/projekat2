const express = require("express");
const db = require("../database/models/index");
const Category = db.Category;
const categoryService = require("../services/category");

const router = new express.Router();

router.post("/categories", async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await categoryService.createCategory(name);
    res.status(201).send(newCategory);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.send(categories);
  } catch (e) {}
});

router.get("/categories/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const category = await categoryService.getCategoryById(_id);

    res.send(category);
  } catch (e) {
    res
      .status(e.status || 500)
      .send({ error: e.message || "Internal Server Error" });
  }
});

router.patch("/categories/:id", async (req, res) => {
  const updates = req.body;
  const _id = req.params.id;

  try {
    const category = await categoryService.updateCategory(updates, _id);
    await category.save();

    res.send(category);
  } catch (e) {
    res
      .status(e.status || 500)
      .send({ error: e.message || "Internal Server Error" });
  }
});

router.delete("/categories/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const category = await categoryService.getCategoryById(_id);

    await categoryService.deleteCategory(category);
    res.send(category);
  } catch (e) {
    res
      .status(e.status || 500)
      .send({ error: e.message || "Internal Server Error" });
  }
});

module.exports = router;
