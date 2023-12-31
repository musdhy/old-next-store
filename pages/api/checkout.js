import { initMongoose } from "../../lib/mongoose";
const stripe = require("stripe")(process.env.SECRET_KEY);
// const sinatra = require("sinatra");
import Product from "../../model/product";
import Order from "../../model/order";

const YOUR_DOMAIN = "http://localhost:3000";

export default async function handler(req, res) {
  await initMongoose();

  if (req.method !== "POST") {
    res.json("should be a post but it's not!");
    return;
  }
  const { email, name, address, city } = req.body;
  const productsIds = req.body.products.split(",");
  const uniqIds = [...new Set(productsIds)];
  const products = await Product.find({ _id: { $in: uniqIds } }).exec();
  let line_items = [];
  for (let productId of uniqIds) {
    const quantity = productsIds.filter((id) => id === productId).length;
    const product = products.find((p) => p._id.toString() === productId);
    line_items.push({
      quantity,
      price_data: {
        currency: "USD",
        product_data: { name: product.name },
        unit_amount: product.price * 100,
      },
    });
  }
  const order = await Order.create({
    products: line_items,
    name,
    email,
    address,
    city,
    paid: 0,
  });

  const session = await stripe.checkout.sessions.create({
    line_items: line_items,
    mode: "payment",
    customer_email: email,
    success_url: `${req.headers.origin}/?success=true`,
    cancel_url: `${req.headers.origin}/?canceled=true`,
    metadata: { orderId: order._id.toString() },
  });

  res.redirect(303, session.url);
}

// sinatra.post("/create-checkout-session", async (req, res) => {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           price: "{{PRICE_ID}}",
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: YOUR_DOMAIN + "/success.html",
//       cancel_url: YOUR_DOMAIN + "/cancel.html",
//     });

//     res.redirect(session.url, 303);
//   } catch (error) {
//     console.error("Error creating checkout session:", error.message);
//     res.status(500).json({ error: "Checkout session creation failed" });
//   }
// });
