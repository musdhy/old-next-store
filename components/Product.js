import React, { useContext } from 'react'
import Image from 'next/image';
import { ProductsContext } from '../context/ProductContext';

const Product = ({product}) => {
  const {setSelectedProducts} = useContext(ProductsContext)
  function addProduct(){
        setSelectedProducts(prev => [...prev, product._id])
  }
  return (
    <div className="py-4">
      <div className="w-60 ">
        <div className="bg-blue-100 p-5 rounded-xl object-contain flex  items-center justify-center ">
          <Image
            src={product.image}
            alt="image"
            height={80}
            width={100}
            className=" object-contain"
          />
        </div>
        <div className="">
          <h3 className="font-bold text-lg">{product.name}</h3>
        </div>
        <div className="text-sm mt-2 leading-5">
          <p>
            {product.description}
          </p>
          <div className="flex mt-3">
            <div className="text-2xl font-bold grow ">${product.price}</div>
            <button onClick={addProduct} className="bg-emerald-400 text-white py-1 px-3 rounded-xl">
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product