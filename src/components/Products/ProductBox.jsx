import React, { useEffect, useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { TiStarFullOutline } from "react-icons/ti";
import { AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import { baseUrl } from "./ProductDetail";
import { UserContext } from "../../Context";
import axios from "axios";


const ProductBox = ({ product }) => {
  const userContext = useContext(UserContext);
  const [productData, setProductData] = useState({});
  const [productInWishlist, setProductInWishlist] = useState(false);
  //const { product_slug, product_id } = useParams();
  const product_id = product.id;
  useEffect(() => {
    fetchData(`${baseUrl}/product/${product_id}`);
    checkProductInWishlist(baseUrl + '/check-in-wishlist/', product_id);
  }, [product_id]);

  function fetchData(url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProductData(data);
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
      });
  }

  function addToWishlistHandler() {
    const customerId = sessionStorage.getItem('customer_id');
    const formData = new FormData();
    formData.append('customer', customerId);
    formData.append('product', productData.id);

    // Log FormData content by iterating over its entries
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    //Submit Data
    axios.post(baseUrl + '/wishlist/', formData)
      .then(function (response) {
        if (response.data.id) {
          setProductInWishlist(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function checkProductInWishlist(baseurl, product_id) {
    const customerId = sessionStorage.getItem('customer_id');
    const formData = new FormData();
    formData.append('customer', customerId);
    formData.append('product', product_id);

    // Log FormData content by iterating over its entries
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    //Submit Data
    if (customerId) {
      axios.post(baseurl, formData)
        .then(function (response) {
          if (response.data.bool == true) {
            setProductInWishlist(true);
          } else {
            setProductInWishlist(false);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }


  return (
    <div
      key={product.id}
      data-aos="fade-up"
      data-aos-delay="100" // Adjust delay dynamically if needed
      className="relative bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 p-2 m-2"
    >
      {/* Product Image with Overlay */}
      <div className="relative group">
        {/* Out of Stock Badge */}
        {product.inventory === 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded z-10">
            Out of Stock
          </div>
        )}

        <Link to={`/product/${product.slug}/${product.id}`}>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[300px] object-cover"
          />
        </Link>

        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity">
          {!productInWishlist && product.inventory > 0 && (
            <button onClick={addToWishlistHandler} className="text-white bg-gray-800 p-2 rounded-full hover:bg-red-500">
              <AiOutlineHeart size={20} />
            </button>
          )}
          <Link
            to={`/product/${product.slug}/${product.id}`}
            className="text-white bg-gray-800 p-2 rounded-full hover:bg-green-500"
          >
            <AiOutlineEye size={20} />
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">
          <Link to={`/product/${product.slug}/${product.id}`}>
            {product.title}
          </Link>
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <TiStarFullOutline className="text-yellow-400" />
          <span className="text-sm">{product.average_rating.toFixed(1) || "4.1"}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-green-600">
            Rs {product.price}
          </span>

          <span className="text-sm text-gray-400 line-through">
            Rs 100
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductBox;