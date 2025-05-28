import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../Context";
import { checkSession } from '../utils/sessionUtils';


function OrderProcessing() {
    const { orderId } = useParams();  // Access orderId from the URL
    const { setCartData } = useContext(CartContext);

    useEffect(() => {
          checkSession();
        }, []);
    // Clear cart data
    localStorage.removeItem('cartData');
    setCartData([]);

    return (
        <div className="max-w-2xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-md text-center">
            <h3 className="text-3xl font-semibold text-blue-600">
                Order no. {orderId} placed with Cash on Delivery!
            </h3>
            <p className="mt-4 text-lg text-gray-700">
                Your order is processing and will be completed after Cash on Delivery payment.
            </p>
            <div className="mt-6">
                <p className="text-sm text-gray-500">
                    Please make the payment to our delivery agent upon receiving the order.
                </p>
            </div>
        </div>
    );
}

export default OrderProcessing;
