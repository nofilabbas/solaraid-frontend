import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faPlusCircle,
  faBox,
  faShoppingCart,
  faUsers,
  faChartBar,
  faComments,
  faUser,
  faKey,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import Logo from "../../assets/Logo.png";


function SellerSidebar() {
  return (
    <div className="flex flex-col bg-gradient-to-r from-blue-500 to-emerald-300 text-black shadow-sm p-4 space-y-2 h-screen">
      <div className="flex items-center justify-start mb-4 space-x-2">
        <img src={Logo} alt="Logo" className="w-10 transform mx-3" style={{ scale: '2.5' }} />
        <h1 className="text-lg font-bold">Solaraid</h1>
      </div>

      <Link to="/seller/dashboard" className="flex items-center space-x-2 px-4 py-2 text-white font-medium rounded-md hover:bg-gray-600 transition">
        <FontAwesomeIcon icon={faTachometerAlt} />
        <span>Dashboard</span>
      </Link>

      <Link to="/seller/add-product" className="flex items-center space-x-2 px-4 py-2 text-white font-medium rounded-md hover:bg-gray-600 transition">
        <FontAwesomeIcon icon={faPlusCircle} />
        <span>Add Product</span>
      </Link>

      <Link to="/seller/products" className="flex items-center space-x-2 px-4 py-2 text-white font-medium rounded-md hover:bg-gray-600 transition">
        <FontAwesomeIcon icon={faBox} />
        <span>Products</span>
      </Link>

      <Link to="/seller/orders" className="flex items-center space-x-2 px-4 py-2 text-white font-medium rounded-md hover:bg-gray-600 transition">
        <FontAwesomeIcon icon={faShoppingCart} />
        <span>Orders</span>
      </Link>

      <Link to="/seller/customers" className="flex items-center space-x-2 px-4 py-2 text-white font-medium rounded-md hover:bg-gray-600 transition">
        <FontAwesomeIcon icon={faUsers} />
        <span>Customers</span>
      </Link>

      <Link to="/seller/reports" className="flex items-center space-x-2 px-4 py-2 text-white font-medium rounded-md hover:bg-gray-600 transition">
        <FontAwesomeIcon icon={faChartBar} />
        <span>Reports</span>
      </Link>

      <Link to="/seller/seller-chats" className="flex items-center space-x-2 px-4 py-2 text-white font-medium rounded-md hover:bg-gray-600 transition">
        <FontAwesomeIcon icon={faComments} />
        <span>Chats</span>
      </Link>

      <Link to="/seller/profile" className="flex items-center space-x-2 px-4 py-2 text-white font-medium rounded-md hover:bg-gray-600 transition">
        <FontAwesomeIcon icon={faUser} />
        <span>Profile</span>
      </Link>

      <Link to="/seller/change-password" className="flex items-center space-x-2 px-4 py-2 text-white font-medium rounded-md hover:bg-gray-600 transition">
        <FontAwesomeIcon icon={faKey} />
        <span>Change Password</span>
      </Link>

      <Link to="/seller/logout" className="flex items-center space-x-2 px-4 py-2 text-red-600 font-medium rounded-md hover:bg-red-100 transition">
        <FontAwesomeIcon icon={faSignOutAlt} />
        <span>Logout</span>
      </Link>
    </div>
  );
}

export default SellerSidebar;
