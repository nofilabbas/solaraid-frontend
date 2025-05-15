import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';

function Wishlist() {
    const baseUrl = 'http://127.0.0.1:8000/api';
    const customerId = localStorage.getItem('customer_id');
    const [totalResults, setTotalResults] = useState(0);
    const [wishItems, setWishItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchData(`${baseUrl}/customer/${customerId}/wishitems/?page=${currentPage}`);
    }, [currentPage]);

    function fetchData(url) {
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data.results); // You can log the entire data object to check the structure
            data.results.forEach(item => {
                console.log(item.product.image); // Log each image URL individually
            });
                setWishItems(data.results);
                setTotalResults(Math.ceil(data.count / 10)); // Assuming 10 items per page
            })
            .catch((error) => {
                console.error('Failed to fetch data:', error);
            });
    }

    function removeFromWishlist(wishlist_id) {
        const formData = new FormData();
        formData.append('wishlist_id', wishlist_id);
        // Submit Data
        axios.post(baseUrl + '/remove-from-wishlist/', formData)
            .then(function (response) {
                if (response.data.bool === true) {
                    const element = document.getElementById('row' + wishlist_id);
                    if (element) {
                        element.remove();
                    } else {
                        console.warn(`Element with ID 'row${wishlist_id}' not found`);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className="container mx-auto">
        <div className="min-h-screen flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <Sidebar />
          </div>
      
          {/* Wishlist Content */}
          <div className="w-full md:w-3/4">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Wishlist</h2>
              <div className="overflow-x-auto">
                <table className="table-auto w-full text-left border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border border-gray-200">#</th>
                      <th className="px-4 py-2 border border-gray-200">Product</th>
                      <th className="px-4 py-2 border border-gray-200">Price</th>
                      <th className="px-4 py-2 border border-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishItems.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50" id={`row${item.id}`}>
                        <td className="px-4 py-2 border border-gray-200">{index + 1}</td>
                        <td className="px-4 py-2 border border-gray-200">
                          <div className="flex items-center">
                            <img
                              src={item.product.image}
                              className="w-16 h-16 object-cover rounded-md border mr-2"
                              alt="Product"
                            />
                            <span>{item.product.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 border border-gray-200">Rs. {item.product.price}</td>
                        <td className="px-4 py-2 border border-gray-200">
                          <div className="relative">
                            <button
                              className="bg-blue-500 text-white text-sm px-3 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                              type="button"
                              onClick={() => removeFromWishlist(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    );
}

export default Wishlist;
