import Image from "next/image";
import { useEffect, useState } from "react";
import Product from "../components/Product";
import { initMongoose } from "../lib/mongoose";
import { findAllProducts } from "./api/products";
import Footer from "../components/Footer";

export default function Home({products}) {
  // const [products, setProducts] = useState([]);
  // useEffect(() => {
  //   fetch("/api/products")
  //     .then((response) => response.json())
  //     .then((data) => setProducts(data))
  //     .catch((error) => console.error("Error fetching products:", error));
  // }, []);

  const categoriesNames = products.map((product) => product.category);
  const categories = Array.from(new Set(categoriesNames));
  const [phrase, setPhrase] = useState("");

  let searchedProducts;
  if (phrase) {
    searchedProducts = products.filter((p) =>
      p.name.toLowerCase().includes(phrase.toLowerCase())
    );
  } else {
    searchedProducts = products;
  }

  return (
    <main>
      <div className="">
        <div className="p-5">
          <input
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            type="text"
            placeholder="Search for products..."
            className="bg-gray-200 w-full py-2 px-4 rounded-xl"
          />
          <div></div>
          {categories.map((category, i) => (
            <div key={i}>
              {searchedProducts.find(
                (searched) => searched.category == category
              ) && (
                <>
                  <h2 className="text-2xl font-bold capitalize">{category}</h2>
                  <div className="flex gap-3 overflow-x-scroll snap-x scrollbar-hide">
                    {searchedProducts
                      ? searchedProducts
                          .filter((product) => product.category === category)
                          .map((product, j) => (
                            <div key={j} className="snap-start">
                              <Product product={product} />
                            </div>
                          ))
                      : null}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <Footer />
      </div>
    </main>
  );
}


export async function getServerSideProps() {
  await initMongoose()
  const products = await findAllProducts()
  return {
    props : {
      products : JSON.parse(JSON.stringify(products))
    }
  }
}