import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faBoxOpen,
  faHeart,
  faMapMarkerAlt,
  faComments,
  faUser,
  faKey,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function Sidebar() {
  return (
    <div className="flex flex-col bg-gradient-to-r from-blue-500 to-emerald-300 text-black shadow-sm p-4 space-y-2 h-screen">
      <div className="flex items-center justify-start mb-4 space-x-2">
        <img src={logo} alt="Logo" className="w-10 transform mx-3" style={{ scale: '2.5' }} />
        <h1 className="text-lg font-bold">Solaraid</h1>
      </div>

      <Link to="/customer/dashboard" className="flex items-center space-x-2 px-4 py-2 text-white font-bold rounded-md hover:bg-gray-600 transition">
        <FontAwesomeIcon icon={faTachometerAlt} />
        <span>Dashboard</span>
      </Link>

      <Link to="/customer/orders" className="flex items-center space-x-2 px-4 py-2 text-white font-bold rounded-md hover:bg-gray-600 transition">
        <FontAwesomeIcon icon={faBoxOpen} />
        <span>Orders</span>
      </Link>

      <Link to="/customer/wishlist" className="flex items-center space-x-2 px-4 py-2 text-white font-bold rounded-md hover:bg-gray-600 transition">
        <FontAwesomeIcon icon={faHeart} />
        <span>Wishlist</span>
      </Link>

      <Link to="/customer/addresses" className="flex items-center space-x-2 px-4 py-2 text-white font-bold rounded-md hover:bg-gray-600 transition">
        <FontAwesomeIcon icon={faMapMarkerAlt} />
        <span>Addresses</span>
      </Link>

      <Link to="/customer/customer-chats" className="flex items-center space-x-2 px-4 py-2 text-white font-bold rounded-md hover:bg-gray-600 transition">
        <FontAwesomeIcon icon={faComments} />
        <span>Chats</span>
      </Link>

      <Link to="/customer/profile" className="flex items-center space-x-2 px-4 py-2 text-white font-bold rounded-md hover:bg-gray-600 transition">
        <FontAwesomeIcon icon={faUser} />
        <span>Profile</span>
      </Link>

      <Link to="/customer/change-password" className="flex items-center space-x-2 px-4 py-2 text-white font-bold rounded-md hover:bg-gray-600 transition">
        <FontAwesomeIcon icon={faKey} />
        <span>Change Password</span>
      </Link>

      <Link to="/customer/logout" className="flex items-center space-x-2 px-4 py-2 text-red-600 font-bold rounded-md hover:bg-red-100 transition">
        <FontAwesomeIcon icon={faSignOutAlt} />
        <span>Logout</span>
      </Link>
    </div>
  );
}

export default Sidebar;
