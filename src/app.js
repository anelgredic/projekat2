const express = require("express");
const productRouter = require("./routers/product");
const categoryRouter = require("./routers/category");

const { sequelize } = require("./database/models");

const app = express();

app.use(express.json());
app.use(productRouter);
app.use(categoryRouter);

const port = process.env.PORT;

async function main() {
  await sequelize
    .sync({ alter: true })
    .then(() => {
      app.listen(port, () => {
        console.log(`Server sluša na portu ${port}`);
      });
    })
    .catch((err) => {
      console.error("Greška prilikom sinhronizacije sa bazom podataka:", err);
    });
}

main();
