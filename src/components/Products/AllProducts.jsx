import React, { useState, useEffect } from "react";
import { TiStarFullOutline } from "react-icons/ti";
import { AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import ProductBox from './ProductBox';
import Slider from '@mui/material/Slider';

const baseUrl = 'http://127.0.0.1:8000/api';

const Products = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isProductsPage = location.pathname === "/products";
  const [products, setProducts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState(""); // **New state for sorting**

  const locations = [...new Set(products.map((p) => p.seller_loc.location))];
  const categories = [...new Set(products.map((p) => p.prod_category.title))];

  useEffect(() => {
    const url = isHomePage
      ? `${baseUrl}/products`
      : `${baseUrl}/products/?page=${currentPage}`;
    fetchData(url);
  }, [currentPage, isHomePage]);

  const fetchData = (url) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data.results);
        setTotalResults(Math.ceil(data.count / 9));
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
      });
  };

  const filteredProducts = products.filter((product) => {
    return (
      (searchTerm === "" ||
        product.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedLocation === "" || product.seller_loc.location === selectedLocation) &&
      (product.price >= priceRange[0] && product.price <= priceRange[1]) &&
      (selectedCategory === "" || product.prod_category.title === selectedCategory)
    );
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case "az":
        return a.title.localeCompare(b.title);
      case "za":
        return b.title.localeCompare(a.title);
      case "priceLowHigh":
        return a.price - b.price;
      case "priceHighLow":
        return b.price - a.price;
      case "dateOldNew":
        return new Date(a.created_at) - new Date(b.created_at);
      case "dateNewOld":
        return new Date(b.created_at) - new Date(a.created_at);
      case "reviews":
        return b.reviews_count - a.reviews_count;
      default:
        return 0;
    }
  });

  const links = [];
  for (let i = 1; i <= totalResults; i++) {
    links.push(
      <li className={`page-item ${i === currentPage ? 'active' : ''}`} key={i}>
        <Link
          onClick={() => setCurrentPage(i)}
          to={`?page=${i}`}
          className="page-link"
        >
          {i}
        </Link>
      </li>
    );
  }

  const displayedProducts = isHomePage ? products.slice(0, 6) : products;

  return (
    <div className="mt-10 mb-10 flex justify-center bg-orange-200">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-md text-primary">
            {isHomePage && "Top Products"}
          </p>
          <h1 data-aos="fade-up" className="text-4xl font-bold">
            {isHomePage ? "Featured Products" : "All Products"}
          </h1>
          <p data-aos="fade-up" className="text-sm text-gray-400">
            {isHomePage && "Check out our best-selling products!"}
          </p>
        </div>
  
        {/* Search and Filters */}
        <div className="mb-4 flex flex-wrap gap-10 items-center justify-center">
          {/* Search Field */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded-md w-full sm:w-64"
          />
  
          {/* Location Filter */}
          <div className="relative group">
            <button className="p-2 bg-transparent border rounded-md w-48 text-left transition-all duration-300 ease-in-out group-hover:border-primary">
              {selectedLocation || "All Locations"}
            </button>
            <div className="absolute hidden group-hover:block bg-white shadow-md rounded-md mt-2 w-full z-10">
              <ul className="py-2">
                
                {locations.map((location, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                    onClick={() => setSelectedLocation(location)}
                  >
                    
                    {location}
                  </li>
                ))}
              </ul>
            </div>
          </div>
  
          {/* Sort Filter */}
          <div className="relative group">
            <button className="p-2 bg-transparent border rounded-md w-48 text-left transition-all duration-300 ease-in-out group-hover:border-primary">
              {selectedSort ? selectedSort : "Sort By"}
            </button>
            <div className="absolute hidden group-hover:block bg-white shadow-md rounded-md mt-2 w-full z-10">
              <ul className="py-2">
                <li
                  className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                  onClick={() => setSelectedSort("az")}
                >
                  Alphabetically, A-Z
                </li>
                <li
                  className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                  onClick={() => setSelectedSort("za")}
                >
                  Alphabetically, Z-A
                </li>
                <li
                  className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                  onClick={() => setSelectedSort("priceLowHigh")}
                >
                  Price, low to high
                </li>
                <li
                  className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                  onClick={() => setSelectedSort("priceHighLow")}
                >
                  Price, high to low
                </li>
                <li
                  className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                  onClick={() => setSelectedSort("dateOldNew")}
                >
                  Date, old to new
                </li>
                <li
                  className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                  onClick={() => setSelectedSort("dateNewOld")}
                >
                  Date, new to old
                </li>
                <li
                  className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                  onClick={() => setSelectedSort("reviews")}
                >
                  Reviews
                </li>
              </ul>
            </div>
          </div>
  
          {/* Category Filter */}
          <div className="relative group">
            <button className="p-2 bg-transparent border rounded-md w-48 text-left transition-all duration-300 ease-in-out group-hover:border-primary">
              {selectedCategory || "All Categories"}
            </button>
            <div className="absolute hidden group-hover:block bg-white shadow-md rounded-md mt-2 w-full z-10">
              <ul className="py-2">
                
                 
               
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>
          </div>
  
        </div>
  
        {/* Product Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.isArray(sortedProducts) && sortedProducts.length > 0 ? (
            sortedProducts.map((product, index) => (
              <ProductBox product={product} key={index} />
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
  
        {/* View All Button for Homepage */}
        {isHomePage && (
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
        )}
  
        {/* Pagination for Products Page */}
        {isProductsPage && (
          <nav aria-label="Page navigation" className="mt-8 flex justify-center">
            <ul className="flex items-center space-x-2">
              {links.map((link, index) => (
                <React.Fragment key={index}>
                  <li
                    className={`px-3 py-2 border rounded ${link.props.className.includes('active')
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {link}
                  </li>
                </React.Fragment>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
  
};

export default Products;
