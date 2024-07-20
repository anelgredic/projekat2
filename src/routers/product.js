const express = require("express");
const { Product, Category, ProductCategory } = require("../database/models");

const router = new express.Router();

// Kreiranje product-a
router.post("/products", async (req, res) => {
  console.log(Product);
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

router.patch(
  "/products/:productId/categories/:categoryId",
  async (req, res) => {
    try {
      const { productId, categoryId } = req.params;
      const product = await Product.findByPk(productId);
      const category = await Category.findByPk(categoryId);

      if (!product || !category) {
        return res
          .status(404)
          .send({ error: "Product or Category not found!" });
      }

      const categoryProduct = await ProductCategory.create({
        productId,
        categoryId,
      });

      res.status(201).send(categoryProduct);
    } catch (e) {
      res.status(500).send();
    }
  }
);

module.exports = router;
