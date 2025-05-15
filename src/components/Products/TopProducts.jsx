import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TiStarFullOutline } from "react-icons/ti";

const baseUrl = 'http://127.0.0.1:8000/api';
const TopProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Fetch data whenever the component mounts
  useEffect(() => {
    fetchData(`${baseUrl}/products/?fetch_limit=3`);
  }, []);

  function fetchData(url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.results);
        setProducts(data.results);
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
      });
  }

  const handleClick = (slug, id) => {
    console.log("clicked");
    navigate(`/product/${slug}/${id}`);
  };

  return (
    <div className="mt-12 mb-12 flex justify-center mx-6">
      <div className="container">
        {/* Hero Section  */}
        <div className="text-center mb-[95px] max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-md text-primary">
            Top Rated Products For You
          </p>
          <h1 data-aos="fade-up" className="text-4xl font-bold">
            Best Products
          </h1>
          <p data-aos="fade-up" className="text-sm text-gray-400">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae
            laboriosam laborum, hic, quas ducimus inventore a possimus assumenda
          </p>
        </div>
        {/* Body section  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-10 place-items-center">
          {products.map((data) => (
            <div
              data-aos="zoom-in"
              data-aos-delay="100"
              key={data.id}
              className="rounded-2xl bg-white hover:bg-black/80 hover:text-white relative shadow-lg hover:shadow-2xl transition-all duration-300 group w-full max-w-sm sm:max-w-xs md:max-w-md min-h-[350px] flex flex-col items-center justify-between p-6"

              
            >
              {/* image section  */}
              <img
                src={data.image}
                alt=""
                className="w-[150px] h-[150px] object-contain transform -translate-y-12 group-hover:scale-110 duration-300 drop-shadow-md"
              />

              {/* Details section */}
              <div className="text-center -mt-6">
                {/* star rating */}
                <div className="flex gap-1 justify-center mb-2">
                  <TiStarFullOutline className="text-yellow-400" />
                  <TiStarFullOutline className="text-yellow-400" />
                  <TiStarFullOutline className="text-yellow-400" />
                  <TiStarFullOutline className="text-yellow-400" />
                </div>
                <h1 className="text-xl font-bold">{data.title}</h1>
                <p className="text-sm mt-2 text-gray-500 line-clamp-2 group-hover:text-white">
                  {data.detail}
                </p>
                <button
                  onClick={() => handleClick(data.slug, data.id)}
                  className="bg-primary hover:scale-105 transition-all text-white py-2 px-6 rounded-full mt-4 group-hover:bg-white group-hover:text-primary"
                >
                  ORDER NOW
                </button>
              </div>
            </div>

          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
