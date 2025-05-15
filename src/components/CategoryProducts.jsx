import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import React from 'react';
import ProductBox from './Products/ProductBox';

const baseUrl = 'http://127.0.0.1:8000/api';

function CategoryProducts() {
  const [productList, setProductList] = useState([]);
  const {category_title} = useParams();
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const { category_slug, category_id } = useParams(); // Destructure category_slug and category_id

  // Fetch data whenever `currentPage` or `category_id` changes
  useEffect(() => {
    fetchData(`${baseUrl}/products/?category=${category_id}&page=${currentPage}`);
  }, [currentPage, category_id]); // Added category_id as a dependency

  function fetchData(url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProductList(data.results);
        setTotalResults(Math.ceil(data.count / 10)); // Assuming 10 items per page
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
      });
  }

  // Create pagination links
  const links = [];
  const totalPages = totalResults; // Total number of pages
  for (let i = 1; i <= totalPages; i++) {
    links.push(
      <li
        className={`mx-1 px-4 py-2 rounded ${i === currentPage ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        key={i}
      >
        <Link
          onClick={() => setCurrentPage(i)} // Update current page
          to={`/category/${category_slug}/${category_id}?page=${i}`}
          className="block"
        >
          {i}
        </Link>
      </li>
    );
  }

  return (
    <section className="max-w-7xl mx-auto container mt-14 mb-12 px-6">
      <h3 className="text-2xl text-center font-bold mb-8">All Products in "{category_title}"</h3>
      
      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                {productList.map((product, index) => (
                    <ProductBox product={product} key={index} />
                ))}
            </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <ul className="flex">{links}</ul>
      </div>
    </section>
  );
}

export default CategoryProducts;
