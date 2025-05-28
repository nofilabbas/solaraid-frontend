import SellerSidebar from "./SellerSidebar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { checkSession } from '../../utils/sessionUtils';
import { faBoxOpen, faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const salesData = [
  { name: "Jan", sales: 400 },
  { name: "Feb", sales: 300 },
  { name: "Mar", sales: 500 },
  { name: "Apr", sales: 700 },
];

const revenueData = [
  { name: "Jan", revenue: 2400 },
  { name: "Feb", revenue: 2210 },
  { name: "Mar", revenue: 2290 },
  { name: "Apr", revenue: 2000 },
];

const customerData = [
  { name: "Jan", customers: 30 },
  { name: "Feb", customers: 45 },
  { name: "Mar", customers: 60 },
  { name: "Apr", customers: 90 },
];

const recentOrders = [
  { id: "#12345", customer: "Ali", date: "2025-04-30", status: "Delivered" },
  { id: "#12346", customer: "Zara", date: "2025-04-29", status: "Pending" },
  { id: "#12347", customer: "Ahmed", date: "2025-04-28", status: "Shipped" },
];

function Dashboard() {
  const baseUrl = "http://127.0.0.1:8000/api";
  const seller_id = sessionStorage.getItem("seller_id");
  const [sellerData, setSellerData] = useState({
    sellerName: null,
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });

  const [sellerOrders, setSellerOrders] = useState([]);

  useEffect(() => {
    checkSession('seller');
    if (seller_id) {
      fetch(baseUrl + "/seller/" + seller_id + "/dashboard/")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setSellerData(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Failed to fetch data:", error);
        });


      // Fetch seller orders
      fetch(`${baseUrl}/seller/${seller_id}/orderitems/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Orders fetch failed");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data.results);
          setSellerOrders(data.results);  // Assuming it's a list
        })
        .catch((error) => {
          console.error("Failed to fetch seller orders:", error);
        });
    }
  }, [seller_id]);

  return (
    <div className="min-h-screen container mx-auto mt-0">
      <div className="grid grid-cols-12 gap-4 min-h-screen">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <SellerSidebar />
        </div>

        {/* Main Dashboard Content */}
        <div className="col-span-12 md:col-span-9 py-8">
          <h2 className="text-2xl font-bold mb-4">
            Good Morning <span className="text-primary font-extrabold">{sellerData.sellerName}</span> 👋
          </h2>

          {/* Top Stat Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Total Products</h3>
                  <Link to="/seller/products" className="text-3xl font-bold hover:underline">
                    {sellerData.totalProducts}
                  </Link>
                </div>
                <FontAwesomeIcon icon={faCartShopping} className="text-2xl text-white" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Total Orders</h3>
                  <Link to="/seller/orders" className="text-3xl font-bold hover:underline">
                    {sellerData.totalOrders}
                  </Link>
                </div>
                <FontAwesomeIcon icon={faBoxOpen} className="text-2xl text-white" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Total Customers</h3>
                  <Link to="/seller/customers" className="text-3xl font-bold hover:underline">
                    {sellerData.totalCustomers}
                  </Link>
                </div>
                <FontAwesomeIcon icon={faUser} className="text-2xl text-white" />
              </div>
            </div>
          </div>

          {/* Graph Boxes Section - Below Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Sales Overview */}
            <div className="bg-white p-4 rounded-xl shadow-md h-64">
              <h4 className="text-gray-700 font-semibold mb-2">Sales Overview</h4>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={salesData}>
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Trend */}
            <div className="bg-white p-4 rounded-xl shadow-md h-64">
              <h4 className="text-gray-700 font-semibold mb-2">Revenue Trend</h4>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={revenueData}>
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Customer Growth */}
            <div className="bg-white p-4 rounded-xl shadow-md h-64">
              <h4 className="text-gray-700 font-semibold mb-2">Customer Growth</h4>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={customerData}>
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="customers" stroke="#f43f5e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white mt-8 p-4 rounded-xl shadow-md">
            <h4 className="text-gray-700 font-semibold mb-4">Recent Orders</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="py-2 px-4">Order ID</th>
                    <th className="py-2 px-4">Customer</th>
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerOrders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-t">
                      <td className="py-2 px-4">{order.id}</td>
                      <td className="py-2 px-4">{order.customer.user.username}</td>
                      <td className="py-2 px-4">{order.order.order_time.slice(0, 10)}</td>
                      <td className="py-2 px-4">{order.order.order_status}</td>
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

export default Dashboard;
