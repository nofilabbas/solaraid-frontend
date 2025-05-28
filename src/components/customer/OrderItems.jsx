import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { checkSession } from '../../utils/sessionUtils';

function OrderItems() {
    const baseUrl = 'http://127.0.0.1:8000/api';
    const customerId = sessionStorage.getItem('customer_id');
    const [totalResults, setTotalResults] = useState(0);
    const [orderItems, setOrderItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('order_time'); // Default sorting field
    const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order
    const { orderId } = useParams(); // Access orderId from URL
    console.log("Order ID:", orderId); 
    
    useEffect(() => {
        checkSession();
        fetchData(`${baseUrl}/customer/${customerId}/orderitems/?order=${orderId}`);
    }, [orderId]);

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
                console.log(data.results);
                setTotalResults(Math.ceil(data.count / 10)); // Assuming 10 items per page
            })
            .catch((error) => {
                console.error('Failed to fetch data:', error);
            });
    }

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
    console.log(sortedOrderItems);


    return (
    <div className="container mx-auto mt-8">
        <div className="flex flex-wrap">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 mb-4">
                <Sidebar />
            </div>

            {/* Main Orders Content */}
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
                                    <th className="px-4 py-2 border border-gray-200">Quantity</th>
                                    <th className="px-4 py-2 border border-gray-200">Recieve Status</th>
                                    <th className="px-4 py-2 border border-gray-200">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedOrderItems.map((item, index) => (
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
                                        <td className="px-4 py-2 border border-gray-200">{item.qty}</td>
                                        <td className="px-4 py-2 border border-gray-200">{item.delivery_status}</td>
                                        <td className="px-4 py-2 border border-gray-200">
                                            {item.order.order_status == "completed" && 
                                            <Link className='bg-primary text-white text-sm px-3 py-2 rounded-md shadow-md hover:bg-primary/80 transition' 
                                            to={`/customer/add-review/${item.product.id}`}>Add Review</Link>}
                                            
                                            {item.order.order_status == "processing" && 
                                            <Link className='bg-primary/80 text-white disabled text-sm px-3 py-2 rounded-md shadow-md opacity-50 cursor-not-allowed pointer-events-none' 
                                            to="#" >Cannot Add Review</Link>}
                                            
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

export default OrderItems;
