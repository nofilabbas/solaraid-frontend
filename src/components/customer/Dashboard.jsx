import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faLocationDot, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { checkSession } from '../../utils/sessionUtils';

function Dashboard() {
  const baseUrl = 'http://127.0.0.1:8000/api';
  var customerId = sessionStorage.getItem('customer_id');
  const [countList, setCountList] = useState({
    customerName: null,
    totalOrders: 0,
    totalWishlist: 0,
    totalAddress: 0,
  });

  useEffect(() => {
     checkSession();
    fetchData(`${baseUrl}/customer/dashboard/${customerId}/`);
  }, []);

  function fetchData(url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setCountList({
          customerName: data.customerName,
          totalOrders: data.totalOrders,
          totalWishlist: data.totalWishList,
          totalAddress: data.totalAddress,
        });
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
      });
  }

  return (
    <div className="min-h-screen container mx-auto mt-0">
      <div className="grid grid-cols-12 gap-4 min-h-screen">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <Sidebar />
        </div>

        {/* Main Dashboard Content */}
        <div className="col-span-12 md:col-span-9 py-8">
        <h2 className="text-2xl font-bold mb-4">
            Good Morning <span className="text-primary font-extrabold">{countList.customerName}</span> 👋
          </h2>
                    {/* Top Stat Boxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-6 shadow-md min-h-[180px] flex flex-col justify-center">
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <h3 className="text-sm font-semibold">Total Orders</h3>
                            <Link to="/customer/orders" className="text-3xl font-bold hover:underline">
                              {countList.totalOrders}
                            </Link>
                          </div>
                          <FontAwesomeIcon icon={faBoxOpen} className="text-2xl text-white" />
                        </div>
                      </div>
          
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-6 shadow-md min-h-[180px] flex flex-col justify-center">
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <h3 className="text-sm font-semibold">Total Wishlist</h3>
                            <Link to="/customer/wishlist" className="text-3xl font-bold hover:underline">
                              {countList.totalWishlist}
                            </Link>
                          </div>
                          <FontAwesomeIcon icon={faHeart} className="text-2xl text-white" />
                        </div>
                      </div>
          
                      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl p-6 shadow-md min-h-[180px] flex flex-col justify-center">
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <h3 className="text-sm font-semibold">Total Addresses</h3>
                            <Link to="/customer/addresses" className="text-3xl font-bold hover:underline">
                              {countList.totalAddress}
                            </Link>
                          </div>
                          <FontAwesomeIcon icon={faLocationDot} className="text-2xl text-white" />
                        </div>
                      </div>
                    </div>


        </div>
      </div>
    </div>
  );
}

export default Dashboard;
