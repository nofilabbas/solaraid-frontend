import React, { useEffect ,useContext, useState } from "react";
import Logo from "../../assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { UserContext, CartContext } from "../../Context";
import { Link, useNavigate, useLocation } from "react-router-dom";


const Navbar = () => {
  const baseUrl = 'http://127.0.0.1:8000/api';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cartData } = useContext(CartContext);
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const checkSeller = localStorage.getItem("seller_login");
  const checkCustomer = localStorage.getItem("customer_login");
  const onSellerDashboard = location.pathname.startsWith("/seller/");
  const cartItems = cartData ? cartData.length : 0;
  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  useEffect(() => {
      fetch(`${baseUrl}/categories/`) // Adjust if pagination is off by default
        .then((response) => response.json())
        .then((data) => {
          // Use `data.results` if paginated, or just `data` if not
          const fetchedCategories = data.results || data; 
          setCategories(fetchedCategories);
        })
        .catch((error) => console.error("Error fetching categories:", error));
    }, []);
  const openCartPage = () => {
    navigate("/checkout");
  };

  const Menu = [
    { id: 1, name: "Home", link: "/#" },
    {
      id: 2,
      name: "Categories",
      link: "/categories",
      dropdown: categories.map((cat) => ({
        name: cat.title,
        link: `/category/${cat.title}/${cat.id}`, // Adjust based on your URL logic
      })),
    },
    { id: 3, name: "Our Products", link: "/products" },
    { id: 4, name: "Solar Calculator", link: "/solar-calculator" },
    {
      id: 6,
      name: "Pages",
      link: "/pages",
      dropdown: [
        { name: "About Us", link: "/about" },
        { name: "Our Services", link: "/services" },
        { name: "FAQ", link: "/faq" },
        { name: "Contact Us", link: "/contact" },
        { name: "Request a Quote", link: "/solar-calculator" },
      ],
    },
  ];

  if (!checkSeller) {
    Menu.push({
      id: 7,
      name: "My Account",
      link: "#",
      dropdown: checkCustomer
        ? [
            { name: "Dashboard", link: "/customer/dashboard" },
            { name: "Logout", link: "/customer/logout" },
          ]
        : [
            { name: "Login", link: "/customer/login" },
            { name: "Register", link: "/customer/register" },
          ],
    });
  }
  
  if (!checkCustomer) {
    Menu.push({
      id: 8,
      name: "Seller Account",
      link: "#",
      dropdown: checkSeller
        ? [
            { name: "Dashboard", link: "/seller/dashboard" },
            { name: "Logout", link: "/seller/logout" },
          ]
        : [
            { name: "Login", link: "/seller/login" },
            { name: "Register", link: "/seller/register" },
          ],
    });
  }
  
  // =================== SELLER DASHBOARD ONLY NAVBAR ===================
  if (checkSeller && onSellerDashboard) {
    return (
      <div className="shadow-md bg-white dark:bg-grey-900 dark:text-white duration-200 relative z-40">
        <div className="bg-black/90 py-2">
          <div className="container flex justify-between items-center">
            <div className="flex items-center gap-3 text-white text-2xl font-bold">
            <img src={Logo} alt="Logo" className="w-10 my-1 transform mx-3" style={{ scale: '2.3' }} />
              Solaraid
            </div>
            <Link to="/seller/logout">
              <button className="px-2 py-1 text-primary hover:text-white border border-primary rounded-full transition duration-200">
                Logout
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =================== MAIN NAVBAR ===================
  return (
    <>
      <div className="shadow-md bg-white dark:bg-grey-900 dark:text-white duration-200 relative z-40">
        {/* Upper Navbar */}
        <div className="bg-black/90 py-2">
          <div className="container flex justify-between items-center">
            <div className="flex items-center gap-3 text-white text-2xl font-bold">
            <img src={Logo} alt="Logo" className="w-10 my-1 transform mx-3" style={{ scale: '2.3' }} />
              Solaraid
            </div>

            {!checkSeller && (
              <>
                <div className="relative group hidden sm:block">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-[200px] group-hover:w-[300px] text-black transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-primary"
                  />
                  <IoMdSearch className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 group-hover:text-primary" />
                </div>

                <button
                  onClick={openCartPage}
                  className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group"
                >
                  <span className="hidden group-hover:block transition-all duration-200">
                    Order
                  </span>
                  {cartItems>0 && cartItems} <FaShoppingCart className="text-xl" />
                </button>
              </>
            )}

            {/* Login/Register/Logout */}
            <div className="flex items-center gap-2">
              {!checkCustomer && !checkSeller ? (
                <>
                  <Link to="/customer/login">
                    <button className="px-2 py-1 text-primary hover:text-white border border-primary rounded-full">
                      Login
                    </button>
                  </Link>
                  <Link to="/customer/register">
                    <button className="px-2 py-1 text-primary hover:text-white border border-primary rounded-full">
                      Register
                    </button>
                  </Link>
                </>
              ) : checkCustomer ? (
                <Link to="/customer/logout">
                  <button className="px-2 py-1 text-primary hover:text-white border border-primary rounded-full">
                    Logout
                  </button>
                </Link>
              ) : null}
            </div>

            {/* Mobile Toggle */}
            <button onClick={toggleMobileMenu} className="sm:hidden text-white text-3xl">
              {isMobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
            </button>
          
          </div>
        </div>

        {/* Lower Navbar */}
        <div className="flex justify-center p-2" data-aos="zoom-out" data-aos-duration="6000">
          <ul className="sm:flex hidden items-center gap-3">
            {Menu.map((data) => (
              <li key={data.id} className="relative group">
                {data.dropdown ? (
                  <>
                    <a href={data.link} className="inline-flex items-center px-4 hover:text-primary">
                      {data.name}
                      <svg
                        className="ml-2 w-4 h-4 group-hover:rotate-180 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </a>
                    <ul className="absolute left-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-1 transition-all duration-300 bg-white border shadow-md rounded-md z-50 min-w-[150px]">
                      {data.dropdown.map((item, index) => (
                        <li key={index}>
                          <a
                            href={item.link}
                            className="block px-4 py-2 hover:bg-gray-100 hover:text-primary"
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <a href={data.link} className="inline-block px-4 hover:text-primary">
                    {data.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

      
        {isMobileMenuOpen && (
  <div className="sm:hidden bg-white shadow-lg rounded-md px-4 py-2 absolute w-full top-[100%] z-50 transition-all duration-300">
    <ul className="flex flex-col gap-2">
      {Menu.map((data) => (
        <li key={data.id}>
          {data.dropdown ? (
            <div>
              <button
                onClick={() => setActiveDropdown(activeDropdown === data.id ? null : data.id)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
              >
                {/* Text for the menu item */}
                {data.name}

                {/* Arrow after the text */}
                <svg
                  className="w-4 h-4 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown items */}
              {activeDropdown === data.id && (
                <ul className="pl-6">
                  {data.dropdown.map((item, index) => (
                    <li key={index}>
                      <a href={item.link} className="block px-4 py-2 hover:bg-gray-100 hover:text-primary">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            // Render normal item without dropdown
            <a href={data.link} className="block px-4 py-2 hover:bg-gray-100">
              {data.name}
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>
)}
        
      </div>
    </>
  );
};

export default Navbar;