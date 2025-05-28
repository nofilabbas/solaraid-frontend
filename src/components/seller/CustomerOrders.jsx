import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SellerSidebar from './SellerSidebar';
import { checkSession } from '../../utils/sessionUtils';


function CustomerOrders() {
    const baseUrl = 'http://127.0.0.1:8000/api';
    const sellerId = sessionStorage.getItem('seller_id');
    const {customer_id} = useParams();
    const [totalResults, setTotalResults] = useState(0);
    const [orderItems, setOrderItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        checkSession('seller');
        fetchData(`${baseUrl}/seller/${sellerId}/customer/${customer_id}/orderitems/?page=${currentPage}`);
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
                setOrderItems(data.results);
                setTotalResults(Math.ceil(data.count / 10)); // Assuming 10 items per page
            })
            .catch((error) => {
                console.error('Failed to fetch data:', error);
            });
    }

    function changeOrderStatus(order_id, status) {
        fetch(baseUrl + '/order-modify/' + order_id + '/', {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ order_status: status })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                fetchData(`${baseUrl}/seller/${sellerId}/customer/${customer_id}/orderitems/`);
            })
            .catch((error) => {
                console.error('Failed to fetch data:', error);
            });
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
        <div className="container mx-auto mt-8">
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/4 mb-4">
                    <SellerSidebar />
                </div>
                <div className="w-full md:w-3/4">
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Orders</h2>
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full text-left border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border border-gray-200">#</th>
                                        <th className="px-4 py-2 border border-gray-200">Order ID</th>
                                        <th className="px-4 py-2 border border-gray-200">Product</th>
                                        <th className="px-4 py-2 border border-gray-200">Price</th>
                                        <th className="px-4 py-2 border border-gray-200">Status</th>
                                        <th className="px-4 py-2 border border-gray-200">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems?.length > 0 ? (
                                        orderItems.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 border border-gray-200">{index + 1}</td>
                                                <td className="px-4 py-2 border border-gray-200">{item.order.id}</td>
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
                                                    {item.order.order_status === 'completed' && (
                                                        <span className="text-green-600 font-medium"><i className="fa fa-check-circle"></i> Completed</span>
                                                    )}
                                                    {item.order.order_status === 'processing' && (
                                                        <span className="text-yellow-500 font-medium"><i className="fa fa-clock"></i> Processing</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 border border-gray-200">
                                                    <div className="relative">
                                                        <button className="bg-blue-500 text-white text-sm px-3 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none" type="button"
                                                            onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>Change Status</button>
                                                        {isOpen && (
                                                            <ul className="absolute mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-40 z-10">
                                                                <li>
                                                                    {item.order.order_status === 'processing' && (
                                                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                changeOrderStatus(item.order.id, "completed");
                                                                                setIsOpen(false);
                                                                            }}>Complete</a>
                                                                    )}
                                                                    {item.order.order_status === 'completed' && (
                                                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                changeOrderStatus(item.order.id, "processing");
                                                                                setIsOpen(false);
                                                                            }}>Processing</a>
                                                                    )}
                                                                </li>
                                                            </ul>
                                                        )}
                                                    </div>
                                                </td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">No orders found.</td>
                                        </tr>
                                    )}
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
        </div >
    );
}

export default CustomerOrders;
