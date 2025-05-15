import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SellerSidebar from './SellerSidebar';
import Dropdown from './Dropdown';

function SellerOrders() {
    const baseUrl = 'http://127.0.0.1:8000/api';
    const sellerId = localStorage.getItem('seller_id');
    const [totalResults, setTotalResults] = useState(0);
    const [orderItems, setOrderItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('order_time'); // Default sorting field
    const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order

    useEffect(() => {
        fetchData(`${baseUrl}/seller/${sellerId}/orderitems/?page=${currentPage}`);
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
                fetchData(`${baseUrl}/seller/${sellerId}/orderitems/`);
            })
            .catch((error) => {
                console.error('Failed to fetch data:', error);
            });
    }

    const handleDeliver = async (orderItemId) => {
        try {
            const response = await fetch(`${baseUrl}/mark-as-delivered/${orderItemId}/`, {
                method: 'POST',
            });
            if (response.ok) {
                alert("Item marked as delivered");
                fetchData(`${baseUrl}/seller/${sellerId}/orderitems/`); // Refresh the list
            } else {
                alert("Failed to mark as delivered");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Sort the data whenever sortField or sortOrder changes
    const sortedOrderItems = [...orderItems].sort((a, b) => {
        if (sortField === 'order_time') {
            return sortOrder === 'asc'
                ? new Date(a.order.order_time) - new Date(b.order.order_time)
                : new Date(b.order.order_time) - new Date(a.order.order_time);
        }
        if (sortField === 'order_amount') {
            return sortOrder === 'asc'
                ? a.order.order_amount - b.order.order_amount
                : b.order.order_amount - a.order.order_amount;
        }
        // Add more fields to sort by if needed
        return 0;
    });

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
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Orders</h2>
                        <div>
                            <label>Sort by:</label>
                            <select
                                value={sortField}
                                onChange={(e) => setSortField(e.target.value)}
                            >
                                <option value="order_time">Order Time</option>
                                <option value="order_amount">Order Amount</option>
                            </select>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full text-left border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border border-gray-200">#</th>
                                        <th className="px-4 py-2 border border-gray-200">Order ID</th>
                                        <th className="px-4 py-2 border border-gray-200">Product</th>
                                        <th className="px-4 py-2 border border-gray-200">Price</th>
                                        <th className="px-4 py-2 border border-gray-200">Status</th>
                                        <th className="px-4 py-2 border border-gray-200">Delivery Status</th>
                                        <th className="px-4 py-2 border border-gray-200">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedOrderItems?.length > 0 ? (
                                        sortedOrderItems.map((item, index) => (
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
                                                    {item.order.order_status === 'pending' && (
                                                        <span className="text-blue-600 font-medium"><i className="fa fa-check-circle"></i> Pending</span>
                                                    )}
                                                </td>
                                                
                                                <td className="px-4 py-2 border border-gray-200">
                                                    {item.delivery_status === 'pending' && (
                                                        <button className='text-blue' onClick={() => handleDeliver(item.id)}>Deliver Now</button>
                                                    )}
                                                    {item.delivery_status === 'delivered' && (
                                                        <button className='text-green'>Delivered</button>
                                                    )}
                                                </td>

                                                <td className="px-4 py-2 border border-gray-200">
                                                    <Dropdown order={item.order} changeOrderStatus={changeOrderStatus} />
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

export default SellerOrders;
