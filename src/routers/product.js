const express = require("express");
const db = require("../database/models/index");
const Product = db.Product;
const Category = db.Category;
const ProductCategory = db.ProductCategory;
const productService = require("../services/product");
const categoryService = require("../services/category");

const router = new express.Router();

// Kreiranje product-a
router.post("/products", async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const newProduct = await productService.createProduct(
      name,
      price,
      description
    );
    res.status(201).send(newProduct);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await productService.getAllProducts();

    res.send(products);
  } catch (e) {}
});

router.get("/products/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await productService.getProductById(_id, true);

    if (!product) {
      return res.status(404).send({ error: "Product not found!" });
    }

    res.send(product);
  } catch (e) {
    res
      .status(e.status || 500)
      .send({ error: e.message } || { error: "Internal Server Error" });
  }
});

router.patch("/products/:id", async (req, res) => {
  const updates = req.body;
  const _id = req.params.id;

  try {
    const product = await productService.updateProduct(updates, _id);
    await product.save();

    res.send(product);
  } catch (e) {
    res
      .status(e.status || 500)
      .send({ error: e.message } || { error: "Internal Server Error" });
  }
});

router.delete("/products/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const product = await productService.getProductById(_id);

    await productService.deleteProduct(product);
    res.send(product);
  } catch (e) {
    res
      .status(e.status || 500)
      .send({ error: e.message } || { error: "Internal Server Error" });
  }
});

// Dodavanje kategorije proizvodu

router.patch("/product/add/category", async (req, res) => {
  try {
    const { productId, categoriesIds } = req.body;

    await productService.getProductById(productId);

    await categoryService.getCategoriesByIds(categoriesIds);
    await productService.addCategoriesToProduct(categoriesIds, productId);

    res.status(201).send({ message: "Categories added to product!" });
  } catch (e) {
    res
      .status(e.status || 500)
      .send({ error: e.message } || { error: "Internal Server Error" });
  }
});

router.delete("/product/delete/category", async (req, res) => {
  const { productId, categoriesIds } = req.body;

  try {
    await productService.getProductById(productId, true);

    await categoryService.getCategoriesByIds(categoriesIds);

    await ProductCategory.destroy({
      where: { productId, categoryId: categoriesIds },
    });

    res.status(201).send({ message: "Categories are deleted from product!" });
  } catch (e) {
    res
      .status(e.status || 500)
      .send({ error: e.message } || { error: "Internal Server Error" });
  }
});

module.exports = router;
