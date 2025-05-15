import { Link } from 'react-router-dom';
import ProductBox from './Products/ProductBox';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const baseUrl = 'http://127.0.0.1:8000/api';

function TagProducts() {
  const [products, setProducts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const { tag } = useParams(); // Destructure tag

  // Fetch data whenever `currentPage` or `tag` changes
  useEffect(() => {
    fetchData(`${baseUrl}/products/${tag}/?page=${currentPage}`);
  }, [currentPage, tag]); // Added tag as a dependency

  function fetchData(url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data.results);
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
        className={`page-item ${i === currentPage ? 'bg-blue-500 text-white' : ''} rounded-full mx-1`}
        key={i}
      >
        <Link
          onClick={() => setCurrentPage(i)} // Update current page
          to={`/products/${tag}/?page=${i}`}
          className="page-link px-3 py-2 rounded-md hover:bg-blue-400 focus:outline-none"
        >
          {i}
        </Link>
      </li>
    );
  }

  return (
    <section className="container mt-6">
      <div className="text-center mb-10 max-w-[600px] mx-auto"> 
          <h3 data-aos="fade-up" className="text-4xl font-bold">{tag} Products</h3>
        </div>
      {/* <h3 className="text-3xl font-semibold text-center text-gray-800 mb-6">{tag} Products</h3> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Render products if available */}
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => <ProductBox product={product} key={product.id} />)
        ) : (
          <p className="text-gray-600">No products available.</p>
        )}
      </div>
      {/* Pagination */}
      <nav aria-label="Page navigation" className="flex justify-center">
        <ul className="pagination flex items-center">{links}</ul>
      </nav>
    </section>
  );
}

export default TagProducts;
