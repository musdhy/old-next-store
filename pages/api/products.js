import Product from "../../model/product";
import { initMongoose } from "../../lib/mongoose";

export async function findAllProducts() {
  return Product.find().exec();
}

export default async function handler(req, res) {
  await initMongoose();

  // Perform database operations
  // Example: Fetch all products
  try {
    const { ids } = req.query;
    if (ids) {
      const idsArray = ids.split(",");
      res.status(200).json(
        await Product.find({
          _id: { $in: idsArray },
        }).exec()
      );
    } else {
      res.json(await findAllProducts());
    }
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Server error" });
  }
}
