import { useState, useEffect } from "react";
import axios from "axios";
import ProductBox from './ProductBox';
import { Link } from "react-router-dom";

function RecommendedProducts() {
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const customerId = sessionStorage.getItem('customer_id');
    if (customerId) {
      axios.post('http://127.0.0.1:8000/api/get_recommendations/', { customer_id: customerId })
        .then(response => {
          setRecommendedProducts(response.data.recommended_products);
          console.log(response.data.recommended_products);
          console.log(response.data.source)
        })
        .catch(error => {
          console.error('Failed to fetch recommendations:', error);
        });
    }
  }, []);

  if (recommendedProducts.length === 0) return null; // Don't show empty section

  return (
    <div className="recommended-section p-4 m-2">
      <h2 className="text-3xl text-center font-bold mb-4">Recommended for You</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {
            recommendedProducts.map((product, index) => (
              <ProductBox product={product} key={index} />
            ))
          }
        </div>

        <div className="text-center mt-8">
            <Link to="/products">
              <button
                data-aos="zoom-in"
                data-aos-delay="100"
                className="text-center mt-10 cursor-pointer bg-primary text-white py-2 px-5 rounded-md hover:bg-white hover:text-orange-500 border-2 border-transparent hover:border-orange-500 transition duration-300"
              >
                VIEW ALL
              </button>
            </Link>
          </div>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recommendedProducts.map(product => (
          <div key={product.id} className="bg-white p-4 rounded shadow m-2">
            <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded" />
            <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
            <p className="text-gray-600">Price: Rs {product.price}</p>
            <p className="text-yellow-500">Rating: {product.average_rating.toFixed(1)}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default RecommendedProducts;
