const express = require("express");
const db = require("../database/models/index");
const Product = db.Product;
const Category = db.Category;
const ProductCategory = db.ProductCategory;

const router = new express.Router();

// Kreiranje product-a
router.post("/products", async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const newProduct = await Product.create({ name, price, description });
    res.status(201).send(newProduct);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: { model: Category, as: "categories" },
    });

    res.send(products);
  } catch (e) {}
});

router.get("/products/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findByPk(_id, {
      include: { model: Category, as: "categories" },
    });

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
    const product = await Product.findByPk(_id);

    if (!product) {
      return res.status(404);
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
    const product = await Product.findByPk(_id);

    if (!product) {
      res.status(404);
    }

    await product.destroy();
    res.send(product);
  } catch (e) {}
});

// Dodavanje kategorije proizvodu

router.patch("/product/add/category", async (req, res) => {
  try {
    const { productId, categoriesIds } = req.body;

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).send({ error: "Product not found!" });
    }

    const categories = await Category.findAll({
      where: { id: categoriesIds },
    });

    if (categories.length !== categoriesIds.length) {
      return res.status(404).send({ error: "Some categories not found!" });
    }

    const productCategories = categoriesIds.map((categoryId) => ({
      productId,
      categoryId,
    }));

    await ProductCategory.bulkCreate(productCategories);

    res.status(201).send({ message: "Categories added to product!" });
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/product/delete/category", async (req, res) => {
  const { productId, categoriesIds } = req.body;

  const product = await Product.findByPk(productId);

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
