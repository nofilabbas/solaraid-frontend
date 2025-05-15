import { Link } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { CartContext } from '../../Context';
import emailjs from 'emailjs-com';

function Checkout() {
  const { cartData, setCartData } = useContext(CartContext);
  const [cartButtonClickStatus, setCartButtonClickStatus] = useState(false);

  // Handle empty or null cart data
  const cartItems = cartData ? cartData.length : 0;
  const cartDataArray = cartData || [];

  // Calculate total price based on quantity
  let totalAmount = cartDataArray.reduce((sum, item) => {
    return sum + (parseFloat(item.product.price || 0) * (item.quantity || 1));
  }, 0)
  localStorage.setItem('totalAmount', totalAmount); // Save totalAmount to localStorage

  // Function to update cart quantity
  const updateCartQuantity = (product_id, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1

    const updatedCart = cartDataArray.map(item => {
      if (item.product.id === product_id) {
        return { ...item, quantity: newQuantity }; // Update quantity
      }
      return item;
    });

    localStorage.setItem('cartData', JSON.stringify(updatedCart));
    setCartData(updatedCart);
  };

  // Function to remove item from cart
  const cartRemoveButtonHandler = (product_id) => {
    let updatedCart = cartDataArray.filter(cart => cart?.product?.id !== product_id);

    if (updatedCart.length === 0) {
      localStorage.removeItem('cartData');
    } else {
      localStorage.setItem('cartData', JSON.stringify(updatedCart));
    }

    setCartData(updatedCart);
    setCartButtonClickStatus(false);
  };
const sendOrderConfirmationEmail = () => {
  const templateParams = {
    to_name: "Customer", // replace dynamically if you want
    message: "Thank you for your order! Your COD order has been confirmed.",
  };

  emailjs.send(
    'solaraidpk',             // Your EmailJS service ID
    'template_gy8cirb',       // Your EmailJS template ID
    templateParams,
    'mghbfUv_kI1ffrh0a'       // Your EmailJS user/public key
  ).then(
    (result) => {
      console.log("Email sent:", result.text);
      alert("Order confirmed email sent!");
    },
    (error) => {
      console.error("Email send error:", error.text);
      alert("Error sending confirmation email.");
    }
  );
};

  return (
    <div className="container mx-auto mt-8 px-4">
      <h3 className="text-2xl font-semibold mb-6">All Items ({cartItems})</h3>
      {cartItems > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Quantity</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {cartDataArray.map((item, index) => {
                const product = item?.product;
                const quantity = item?.quantity || 1;
                const totalPrice = parseFloat(product?.price || 0) * quantity;

                return (
                  <tr key={index} className="border-t">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 flex items-center gap-4">
                      <Link>
                        <img
                          src={product?.image}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          alt={product?.title || 'Product'}
                        />
                      </Link>
                      <p>
                        <Link className="text-blue-600 hover:underline">{product?.title}</Link>
                      </p>
                    </td>
                    <td className="p-4">Rs. {product?.price}</td>
                    <td className="p-4 flex items-center">
                      <button
                        onClick={() => updateCartQuantity(product?.id, quantity - 1)}
                        className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
                      >
                        -
                      </button>
                      <span className="px-4">{quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(product?.id, quantity + 1)}
                        className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
                      >
                        +
                      </button>
                    </td>
                    <td className="p-4">Rs. {totalPrice}</td>
                    <td className="p-4">
                      <button
                        onClick={() => cartRemoveButtonHandler(product?.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100">
                <td className="p-4"></td>
                <td className="p-4 font-semibold">Total</td>
                <td className="p-4"></td>
                <td className="p-4"></td>
                <td className="p-4 font-semibold">Rs. {totalAmount}</td>
                <td className="p-4"></td>
              </tr>
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  <Link
                    to="/products"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 mx-2"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    to="/confirm-order"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                  >
                    Proceed to Payment
                  </Link>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="text-center mt-10">
          <h5 className="text-xl font-semibold mb-4">Your cart is empty</h5>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Go to Home
          </Link>
        </div>
      )}
    </div>
  );
}

export default Checkout;
