const express = require("express");
const db = require("../database/models/index");
const Product = db.Product;
const Category = db.Category;
const ProductCategory = db.ProductCategory;
const productService = require("../services/product");

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
    res.status(500).send(e);
  }
});

router.patch("/products/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "price", "description"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  const _id = req.params.id;

  try {
    const product = await productService.getProductById(_id);

    if (!product) {
      return res.status(404).send();
    }

    updates.forEach((update) => (product[update] = req.body[update]));
    await product.save();

    res.send(product);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/products/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const product = await productService.getProductById(_id);

    if (!product) {
      res.status(404).send();
    }

    await productService.deleteProduct(product);
    res.send(product);
  } catch (e) {}
});

// Dodavanje kategorije proizvodu

router.patch("/product/add/category", async (req, res) => {
  try {
    const { productId, categoriesIds } = req.body;

    const product = await productService.getProductById(productId);

    if (!product) {
      return res.status(404).send({ error: "Product not found!" });
    }

    const categories = await Category.findAll({
      where: { id: categoriesIds },
    });

    if (categories.length !== categoriesIds.length) {
      return res.status(404).send({ error: "Some categories not found!" });
    }

    await productService.addCategoriesToProduct(categoriesIds, productId);

    res.status(201).send({ message: "Categories added to product!" });
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/product/delete/category", async (req, res) => {
  const { productId, categoriesIds } = req.body;

  const product = await productService.getProductById(productId);

  if (!product) {
    return res.status(404).send({ error: "Product not found!" });
  }

  const categories = await Category.findAll({ where: { id: categoriesIds } });

  if (categories.length !== categoriesIds.length) {
    return res.status(404).send({ error: "Some categories not found!" });
  }

  await ProductCategory.destroy({
    where: { productId, categoryId: categoriesIds },
  });

  res.status(201).send({ message: "Categories are deleted from product!" });
});

module.exports = router;
