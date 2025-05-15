import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SellerSidebar from './SellerSidebar';

function Customers() {
    const baseUrl = 'http://127.0.0.1:8000/api';
    const sellerId = localStorage.getItem('seller_id');
    const [customerList, setCustomerList] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchData(`${baseUrl}/seller/${sellerId}/customers/?page=${currentPage}`);
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
                console.log(data.results);
                setCustomerList(data.results);
                setTotalResults(Math.ceil(data.count / 10)); // Assuming 10 items per page
            })
            .catch((error) => {
                console.error('Failed to fetch data:', error);
            });
    }

    function showConfirm(customer_id) {
        const confirmDelete = window.confirm('Are you sure to delete this customer?');
        if (confirmDelete) {
            fetch(`${baseUrl}/delete-customer-orders/${customer_id}/`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.bool === true) {
                        fetchData(`${baseUrl}/seller/${sellerId}/customers/`);
                    }
                })
                .catch((error) => console.error('Failed to delete customer:', error));
        }
    }
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
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Customers</h2>
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full text-left border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border border-gray-200">#</th>
                                        <th className="px-4 py-2 border border-gray-200">Name</th>
                                        <th className="px-4 py-2 border border-gray-200">Email</th>
                                        <th className="px-4 py-2 border border-gray-200">Phone</th>
                                        <th className="px-4 py-2 border border-gray-200">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerList.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-2 border border-gray-200">{item.user.username}</td>
                                            <td className="px-4 py-2 border border-gray-200">{item.user.email}</td>
                                            <td className="px-4 py-2 border border-gray-200">{item.mobile}</td>
                                            <td className="px-4 py-2 border border-gray-200">
                                                <Link
                                                    to={`/seller/${sellerId}/customer/${item.id}/orderitems/`}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded"
                                                >
                                                    Orders
                                                </Link>
                                                <button
                                                    onClick={() => showConfirm(item.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded ml-2"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <nav aria-label="Page navigation example" className="mt-4">
                            <ul className="flex justify-center">
                                {links}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Customers;
