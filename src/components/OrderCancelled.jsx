import React, { useContext } from "react";
import { CartContext } from "../Context";

function OrderCancelled() {
    const { setCartData } = useContext(CartContext);
    setCartData([]);

    return (
        <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-md text-center">
            <h1 className="text-3xl font-semibold text-red-600">Payment Canceled</h1>
            <p className="mt-4 text-lg text-gray-700">
                Your payment has been canceled. If you have any issues or need help, please contact our support team.
            </p>
            <a 
                href="/" 
                className="mt-6 inline-block py-2 px-6 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Return to Home
            </a>
        </div>
    );
}

export default OrderCancelled;
