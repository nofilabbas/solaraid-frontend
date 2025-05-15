import { Link } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import { useState, useEffect } from 'react';

function SellerProducts() {
    const baseUrl = 'http://127.0.0.1:8000/api';
    const [productData, setProductData] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const sellerId = localStorage.getItem('seller_id');

    useEffect(() => {
        fetchData(`${baseUrl}/seller-products/${sellerId}/?page=${currentPage}`);
    }, [currentPage]);

    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProductData(data.results);
            console.log(data.results)
            setTotalResults(Math.ceil(data.count / 10)); // Assuming 10 items per page
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const showConfirm = async (productId) => {
        const confirmDelete = window.confirm('Are you sure to delete this product?');
        if (confirmDelete) {
            try {
                const response = await fetch(`${baseUrl}/product/${productId}/`, {
                    method: 'DELETE',
                });
                if (response.status === 204) {
                    fetchData(`${baseUrl}/seller-products/${sellerId}/?page=${currentPage}`);
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    // Create pagination links
    const links = [];
    for (let i = 1; i <= totalResults; i++) {
        links.push(
            <li className={`page-item ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} mx-1`} key={i}>
                <button
                    onClick={() => setCurrentPage(i)}
                    className="px-3 py-1 rounded focus:outline-none"
                >
                    {i}
                </button>
            </li>
        );
    }

    return (
        <div className="container mx-auto">
  <div className="flex flex-wrap">
    <div className="w-full md:w-1/4 mb-4">
      <SellerSidebar />
    </div>
    <div className="w-full md:w-3/4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Your Products</h2>
          <Link
            to="/seller/add-product"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
          >
            <i className="fa fa-plus-circle mr-1"></i> Add Product
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 border border-gray-200">#</th>
                <th className="px-4 py-3 border border-gray-200">Product</th>
                <th className="px-4 py-3 border border-gray-200">Price</th>
                <th className="px-4 py-3 border border-gray-200">Category</th>
                <th className="px-4 py-3 border border-gray-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productData.length > 0 ? (
                productData.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-200 text-center">{index + 1}</td>
                    <td className="px-4 py-2 border border-gray-200">
                      <Link to={`/seller/update-product/${product.id}`} className="text-blue-600 font-medium hover:underline">
                        {product.title}
                      </Link>
                    </td>
                    <td className="px-4 py-2 border border-gray-200">Rs. {product.price}</td>
                    <td className="px-4 py-2 border border-gray-200">{product.prod_category.title}</td>
                    <td className="px-4 py-2 border border-gray-200 text-center">
                      <Link
                        to={`/seller/update-product/${product.id}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => showConfirm(product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <nav aria-label="Page navigation example" className="mt-6">
          <ul className="flex justify-center">{links}</ul>
        </nav>
      </div>
    </div>
  </div>
</div>

    );
}

export default SellerProducts;
