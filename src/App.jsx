// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ForgotPasswordPage from './pages/ForgotPasswordPage';
// import { useEffect } from "react";
// import AOS from "aos";
// import "aos/dist/aos.css";

// // Importing components
// import Navbar from "./components/Navbar/Navbar";
// import Hero from "./components/Hero/Hero";

// import AllProducts from "./components/Products/AllProducts";
// import TopProducts from "./components/Products/TopProducts";
// import Banner from "./components/Banner/Banner";
// import Suscribe from "./components/Banner/Suscribe";
// import Testimonials from "./components/Testimonials/Testimonials";
// import Footer from "./components/Footer/Footer";
// import SolarCalculator from "./components/Costcalculation/SolarCalculator";

// import ChatBox from "./components/Chatbox/Chatbox";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import SolarSolutions from "./components/Solarsolution/Solarsolution.jsx";
// import ProductDetail from "./components/Products/Productdetail";

// function App() {
//   // Initialize AOS library for animations
//   useEffect(() => {
//     AOS.init({
//       offset: 100,
//       duration: 800,
//       easing: "ease-in-out",
//       delay: 100,
//     });
//     AOS.refresh();
//   }, []);

//   return (
//     <Router>
//       {/* Navbar */}
//       <Navbar />
//       <ChatBox /> 

//       {/* Routes */}
//       <Routes>

//         <Route path="/products" element={<AllProducts />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//         <Route path="/solar-calculator" element={<SolarCalculator />} />
//         <Route path="/product/:id" element={<ProductDetail />}/>


//         {/* Home route */}
//         <Route
//           path="/"
//           element={
//             <>
//               <Hero />
//               <AllProducts />
//               <TopProducts />
//               <Banner />
//               <Suscribe />
//            <SolarSolutions/>
//               <Testimonials />
//               <Footer />
//             </>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import { useLocation } from 'react-router-dom';
import 'aos/dist/aos.css';

// Importing components
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import ChatBox from "./components/Chatbox/Chatbox";
import Footer from './components/Footer/Footer';
import SmallFooter from './components/Footer/SmallFooter';
import AllProducts from './components/Products/AllProducts';
import ProductDetail from './components/Products/ProductDetail';
import TopProducts from "./components/Products/TopProducts";
import RecommendedProducts from './components/Products/RecommendedProducts';
import AllCategories from './components/AllCategories';
import CategoryProducts from './components/CategoryProducts';
import Checkout from './components/Navbar/Checkout';
import ConfirmOrder from './components/ConfirmOrder';
import OrderSuccess from './components/OrderSuccess';
import OrderFailure from './components/OrderFailure';
import OrderCancelled from './components/OrderCancelled';
import OrderCompleted from './components/OrderCompleted';
import OrderProcessing from './components/OrderProcessing';
import Contact from "./components/Contact/Contact";
//import Categories from './components/Categories';
//import CategoryProducts from './components/CategoryProducts';
import TagProducts from './components/TagProducts';
import Testimonials from './components/Testimonials/Testimonials';
import Banner from './components/Banner/Banner';
import Benefits from './components/Benefits/Benefits';
import Suscribe from './components/Banner/Suscribe';
import SolarCalculator from './components/Costcalculation/SolarCalculator';
    import SolarSolutions from './components/Solarsolution/Solarsolution';
    import Services from './components/Services/services';
    import About from './components/About/Aboutus';
    import FAQ from './components/FAQ/FAQ';
// Authentication & User Panel
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Customer Routes
import Register from './components/customer/Register';
import Login from './components/customer/Login';
import Logout from './components/customer/Logout';
import CustomerForgotPasswordPage from './components/customer/CustomerForgotPasswordPage';
import CustomerResetPasswordPage from './components/customer/CustomerResetPasswordPage';
import Dashboard from './components/customer/Dashboard';
import Orders from './components/customer/Orders';
import OrderItems from './components/customer/OrderItems';
import Wishlist from './components/customer/Wishlist';
import Profile from './components/customer/Profile';
import AddressList from './components/customer/AddressList';
import AddAddress from './components/customer/AddAddress';
import UpdateAddress from './components/customer/UpdateAddress';
import ChangePassword from './components/customer/ChangePassword';
import AddReview from './components/customer/AddReview';
import CustomerChats from './components/customer/CustomerChats';


// Seller Routes
import SellerRegister from './components/seller/SellerRegister';
import SellerLogin from './components/seller/SellerLogin';
import SellerLogout from './components/seller/SellerLogout';
import SellerForgotPasswordPage from './components/seller/SellerForgotPasswordPage';
import SellerResetPasswordPage from './components/seller/SellerResetPasswordPage';
import SellerDetail from './components/seller/SellerDetail';
import SellerDashboard from './components/seller/SellerDashboard';
import SellerProducts from './components/seller/SellerProducts';
import AddProduct from './components/seller/AddProduct';
import UpdateProduct from './components/seller/UpdateProduct';
import SellerOrders from './components/seller/SellerOrders';
import Customers from './components/seller/Customers';
import CustomerOrders from './components/seller/CustomerOrders';
import Reports from './components/seller/Reports';
import DailyReport from './components/seller/DailyReport';
import MonthlyReport from './components/seller/MonthlyReport';
import YearlyReport from './components/seller/YearlyReport';
import SellerProfile from './components/seller/SellerProfile';
import SellerChangePassword from './components/seller/SellerChangePassword';
import AllSellers from './components/seller/AllSellers';
import TopSellers from './components/seller/TopSellers';
import SellerChats from './components/seller/SellerChats';

import { CartContext } from './Context';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Set up cart data from localStorage
const checkCart = localStorage.getItem('cartData');

function App() {
  const location = useLocation();
  // Check if the current route is the homepage
  const isHomePage = location.pathname === "/";

  // Initialize AOS library for animations
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: 'ease-in-out',
      delay: 100,
    });
    AOS.refresh();
  }, []);

  const [cartData, setCartData] = useState(JSON.parse(checkCart));

  return (
    <CartContext.Provider value={{ cartData, setCartData }}>
<div className="flex flex-col min-h-screen bg-customBg"> {/* Ensure the page takes at least the full screen height */}
      {/* Navbar */}
      <Navbar />
      <ChatBox />
      {/* Routes */}
      <main className="flex-grow "> {/* Content grows to fill remaining space */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Hero />
            <RecommendedProducts />
            <TopProducts />
            <Benefits/>
            <TopSellers />
            <Banner />
            <Suscribe />
            <SolarSolutions />
          
            <Testimonials />
          </> } />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/categories/" element={<AllCategories />} />
        <Route path="/category/:category_title/:category_id/" element={<CategoryProducts />} />
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
        <Route path="/solar-calculator" element={<SolarCalculator />} />
        <Route path="/solar-solutions" element={<SolarSolutions />} />
           <Route path="/contact" element={<Contact />} />
           <Route path="/about" element={<About/>} />  
<Route path="/services" element={<Services />} />
<Route path="/faq" element={<FAQ />} />
 
        {/* <Route path="/categories" element={<Categories />} /> */}
        {/* <Route path="/category/:category_slug/:category_id" element={<CategoryProducts />} /> */}
        <Route path="/product/:product_slug/:product_id" element={<ProductDetail />} />
        <Route path="/products/:tag" element={<TagProducts />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirm-order" element={<ConfirmOrder />} />
        <Route path="/order/success" element={<OrderSuccess />} />
        <Route path="/order/failure" element={<OrderFailure />} />
        <Route path="/order/cancel" element={<OrderCancelled />} />
        <Route path="/payment/success" element={<OrderCompleted />} />
        <Route path="/payment/cancel" element={<OrderCancelled />} />
        <Route path="/order-processing/:orderId" element={<OrderProcessing />} />

        {/* Customer Routes */}
        <Route path="/customer/register" element={<Register />} />
        <Route path="/customer/login" element={<Login />} />
        <Route path="/customer/logout" element={<Logout />} />
        <Route path="/customer-forgot-password" element={<CustomerForgotPasswordPage />} />
        <Route path="/customer/reset-password/:token" element={<CustomerResetPasswordPage />} />
        <Route path="/customer/dashboard" element={<Dashboard />} />
        <Route path="/customer/orders" element={<Orders />} />
        <Route path="/customer/orderitems/:orderId" element={<OrderItems />} />
        <Route path="/customer/wishlist" element={<Wishlist />} />
        <Route path="/customer/profile" element={<Profile />} />
        <Route path="/customer/addresses" element={<AddressList />} />
        <Route path="/customer/add-address" element={<AddAddress />} />
        <Route path="/customer/update-address/:address_id" element={<UpdateAddress />} />
        <Route path="/customer/change-password" element={<ChangePassword />} />
        <Route path="/customer/add-review/:product_id" element={<AddReview />} />
        <Route path="/customer/customer-chats" element={<CustomerChats />} />
        

        {/* Seller Routes */}
        <Route path="/seller/register" element={<SellerRegister />} />
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/seller/logout" element={<SellerLogout />} />
        <Route path="/seller-forgot-password" element={<SellerForgotPasswordPage />} />
        <Route path="/seller/reset-password/:token" element={<SellerResetPasswordPage />} />
        <Route path="/sellers" element={<AllSellers />} />
        <Route path="/seller/:seller_username/:seller_id" element={<SellerDetail />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/products" element={<SellerProducts />} />
        <Route path="/seller/add-product" element={<AddProduct />} />
        <Route path="/seller/update-product/:product_id" element={<UpdateProduct />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/seller/customers" element={<Customers />} />
        <Route path="/seller/:seller_id/customer/:customer_id/orderitems" element={<CustomerOrders />} />
        <Route path="/seller/reports" element={<Reports />} />
        <Route path="/seller/daily-report" element={<DailyReport />} />
        <Route path="/seller/monthly-report" element={<MonthlyReport />} />
        <Route path="/seller/yearly-report" element={<YearlyReport />} />
        <Route path="/seller/profile" element={<SellerProfile />} />
        <Route path="/seller/change-password" element={<SellerChangePassword />} />
        <Route path="/seller/seller-chats" element={<SellerChats />} />

        {/* <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> */}
       
      </Routes>
      </main>
      {/* Conditionally render footer based on the current route */}
      {isHomePage ? (
        <Footer />  // Display the main footer only on the homepage
      ) : (
        <SmallFooter />  // Display the small footer on other pages
      )}
      </div>
    </CartContext.Provider>
  );
}

export default App;
