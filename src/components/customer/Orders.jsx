import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

function Orders() {
    const baseUrl = 'http://127.0.0.1:8000/api';
    const customerId = localStorage.getItem('customer_id');
    const [totalResults, setTotalResults] = useState(0);
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('order_time'); // Default sorting field
    const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order


    useEffect(() => {
        fetchData(`${baseUrl}/customer/${customerId}/orders/?page=${currentPage}`);
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
                setOrders(data.results);
                console.log(data);
                console.log(data.results);
                setTotalResults(Math.ceil(data.count / 10)); // Assuming 10 items per page
            })
            .catch((error) => {
                console.error('Failed to fetch data:', error);
            });
    }

    const sortedOrders = [...orders].sort((a, b) => {
        if (sortField === 'order_time') {
            return sortOrder === 'asc'
                ? new Date(a.order_time) - new Date(b.order_time)
                : new Date(b.order_time) - new Date(a.order_time);
        }
        if (sortField === 'order_amount') {
            return sortOrder === 'asc'
                ? a.order_amount - b.order_amount
                : b.order_amount - a.order_amount;
        }
        // Add more fields to sort by if needed
        return 0;
    });

    const handleReceive = async (orderId) => {
        try {
            const response = await fetch(`${baseUrl}/mark-as-received/${orderId}/`, {
                method: 'POST',
            });
            if (response.ok) {
                alert("Order marked as received");
                fetchData(`${baseUrl}/customer/${customerId}/orders/`);
            } else {
                alert("Failed to mark as received");
            }
        } catch (error) {
            console.error("Error:", error);
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
            <div className="min-h-screen flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="w-full md:w-1/4 md:min-h-screen">
                    <Sidebar />
                </div>

                {/* Main Orders Content */}
                <div className="w-full md:w-3/4">
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Orders</h2>

                        {/* Sorting */}
                        <div className="mb-4 flex items-center gap-4">
                            <label className="font-medium">Sort by:</label>
                            <select
                                value={sortField}
                                onChange={(e) => setSortField(e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1"
                            >
                                <option value="order_time">Order Time</option>
                                <option value="order_amount">Order Amount</option>
                            </select>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full text-left border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border">#</th>
                                        <th className="px-4 py-2 border">Order ID</th>
                                        <th className="px-4 py-2 border">Order Amount</th>
                                        <th className="px-4 py-2 border">Payment Status</th>
                                        <th className="px-4 py-2 border">Delivery Status</th>
                                        {/* <th className="px-4 py-2 border">Actions</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedOrders.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border">{index + 1}</td>
                                            <td className="px-4 py-2 border">
                                                <Link to={`/customer/orderitems/${item.id}`}>{item.id}</Link>
                                            </td>
                                            <td className="px-4 py-2 border">Rs. {item.order_amount}</td>
                                            <td className="px-4 py-2 border">
                                                {item.order_status === "completed" && (
                                                    <span className="text-green-600 font-medium">
                                                        <i className="fa fa-check-circle"></i> Completed
                                                    </span>
                                                )}
                                                {item.order_status === "processing" && (
                                                    <span className="text-yellow-500 font-medium">
                                                        <i className="fa fa-spinner fa-spin"></i> Processing
                                                    </span>
                                                )}
                                                {item.order_status === "pending" && (
                                                    <span className="text-blue-500 font-medium">
                                                        <i className="fa fa-clock"></i> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {item.received_status ? (
                                                    <button className="bg-green-500 text-white font-semibold px-4 py-2 rounded-md shadow-md cursor-default">
                                                        ✅ Received
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleReceive(item.id)}
                                                        disabled={
                                                            !item.order_items ||
                                                            !item.order_items.every(
                                                                (orderItem) => orderItem.delivery_status === "delivered"
                                                            )
                                                        }
                                                        className={`px-4 py-2 rounded-md shadow-md transition ${!item.order_items ||
                                                                !item.order_items.every(
                                                                    (orderItem) => orderItem.delivery_status === "delivered"
                                                                )
                                                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                                                : "bg-blue-500 hover:bg-blue-600 text-white"
                                                            }`}
                                                    >
                                                        📦 Receive Now
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {/* Future Review Action buttons */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <nav aria-label="Page navigation" className="mt-4">
                            <ul className="flex justify-center">{links}</ul>
                        </nav>
                    </div>
                </div>
            </div>

        </div>
    );

}

export default Orders;






{/* {item.order_status == "completed" &&
                                                    <Link className='bg-primary text-white text-sm px-3 py-2 rounded-md shadow-md hover:bg-primary/80 transition'
                                                        to={`/customer/add-review/${item.product.id}`}>Add Review</Link>}

                                                {item.order_status == "processing" &&
                                                    <Link className='bg-primary/80 text-white disabled text-sm px-3 py-2 rounded-md shadow-md opacity-50 cursor-not-allowed pointer-events-none'
                                                        to="#" >Cannot Add Review</Link>} */}