import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { CartContext } from "../Context";
import axios from "axios";
import { checkSession } from '../utils/sessionUtils';


const baseUrl = 'http://127.0.0.1:8000/api/';

function OrderCompleted() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get('success');
    const sessionId = queryParams.get('session_id');
    const { setCartData } = useContext(CartContext);
    const payMethod = localStorage.getItem('payMethod');
    const orderId = localStorage.getItem('orderId');

    useEffect(() => {
        checkSession();
        if (success) {
            console.log("Payment Successful! Session ID:", sessionId);
            // You can now fetch the order details using the session ID
            // Step 1: Verify the payment session
            axios.get(`${baseUrl}verify-payment-session/${sessionId}`)
                .then(response => {
                    // handle the response
                    console.log('Payment Session Verified', response.data);

                    // Step 2: Update order status
                    return axios.post(`${baseUrl}update-order-status/`, {
                        session_id: sessionId,
                        payment_method: payMethod, // Pass the payment method
                        order_id: orderId,
                    });
                })
                .then(updateResponse => {
                    console.log("Order Status Updated", updateResponse.data);
                    // Step 3: Clear the cart from localStorage
                    localStorage.removeItem('cartData');
                    // Update the cart state to an empty array
                    setCartData([]);
                })
                .catch(error => {
                    console.log('Error verifying payment session', error);
                });
        } else {
            console.log("Payment Canceled.");
        }
    }, [success, sessionId]);

    return (
        <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-md text-center">
            {success ? (
                <div>
                    <h3 className="text-3xl font-semibold text-green-600">Payment Successful!</h3>
                    <p className="mt-4 text-lg text-gray-700">
                        Your order with ID: <span className="font-bold">{orderId}</span> has been successfully completed.
                    </p>
                </div>
            ) : (
                <div>
                    <h3 className="text-3xl font-semibold text-red-600">Payment Canceled</h3>
                    <p className="mt-4 text-lg text-gray-700">
                        Unfortunately, your payment was canceled. If you need assistance, please contact our support team.
                    </p>
                </div>
            )}
            <a 
                href="/" 
                className="mt-6 inline-block py-2 px-6 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Return to Home
            </a>
        </div>
    );
}

export default OrderCompleted;
