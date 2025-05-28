import { useContext, useEffect, useState } from "react";
import { UserContext, CartContext } from "../Context";
import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import axios from "axios";
import { checkSession } from '../utils/sessionUtils';

const baseUrl = 'http://127.0.0.1:8000/api/';

function ConfirmOrder() {
    const userContext = useContext(UserContext);
    const [orderId, setOrderId] = useState('');
    const [payMethod, setPayMethod] = useState('');
    const navigate = useNavigate();
    const { cartData, setCartData } = useContext(CartContext);
    const totalAmount = parseFloat(localStorage.getItem('totalAmount')); // Retrieve grandTotal from localStorage
    console.log(totalAmount);
  const shipmentFee = 200;

    
    useEffect(() => {
        checkSession();
        if (!userContext) {
            window.location.href = '/customer/login';
        } else {
            addOrderInTable();
        }
    }, []);

    function addOrderInTable() {
        const customerId = sessionStorage.getItem('customer_id');
        if (!customerId) {
            console.error("Customer ID is missing");
            return;
        }
        const formData = new FormData();
        formData.append('customer', customerId);
        formData.append('totalAmount', totalAmount);

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        axios.post(baseUrl + 'orders/', formData)
            .then(function (response) {
                const orderId = response.data.id;
                orderItems(orderId);
                setOrderId(orderId);
                localStorage.setItem('orderId', orderId);


            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function orderItems(orderId) {
        const previousCart = localStorage.getItem('cartData');
        const cartJson = JSON.parse(previousCart);
        console.log(cartJson);
        if (cartJson != null) {
            cartJson.map((cart) => {
                const formData = new FormData();
                formData.append('order', orderId);
                formData.append('product', cart.product.id);
                formData.append('qty', cart.quantity);
                formData.append('price', cart.product.price);

                for (let [key, value] of formData.entries()) {
                    console.log(key, value);
                }
                axios.post(baseUrl + 'orderitems/', formData)
                    .then(function () {
                        console.log(`Order item for product ${cart.product.title} added successfully.`);

                        recordInteraction(cart.product.id, 'order');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            });
        }
    }


    function recordInteraction(productId, interactionType) {
        const customerId = sessionStorage.getItem('customer_id');
      
        if (!customerId || !productId) {
          console.error("Customer ID or Product ID missing");
          return;
        }
      
        fetch(baseUrl + 'record_interaction/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer_id: customerId,
            product_id: productId,
            interaction_type: interactionType,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Interaction recorded:", data);
          })
          .catch((error) => {
            console.error("Error recording interaction:", error);
          });
      }

      
    function changePaymentMethod(payMethod) {
        setPayMethod(payMethod);
        localStorage.setItem('payMethod', payMethod);
    }

    function payNowButton() {
        if (payMethod === 'stripe') {
            const cartData = JSON.parse(localStorage.getItem('cartData'));

            if (!cartData || cartData.length === 0) {
                alert('Cart is empty!');
                return;
            }

            axios.post(`${baseUrl}create-checkout-session/`, {
                cartData: JSON.parse(localStorage.getItem('cartData')),
                order_id: orderId,
                shipment_fee: shipmentFee,
            })
                .then(function (response) {
                    if (response.data.url) {
                        window.location.href = response.data.url;
                    } else {
                        alert('Failed to get Stripe session URL.');
                    }
                })
                .catch(function (error) {
                    console.error("Error creating Stripe Checkout session:", error);
                    alert('Something went wrong. Please try again.');
                });
        } else if (payMethod === 'cod') {
            axios.post(`${baseUrl}update-order-status/`, {
                order_id: orderId,
                payment_method: 'cod',
            })
                .then(function () {
                    navigate(`/order-processing/${orderId}`);
                })
                .catch(function (error) {
                    console.error("Error updating order status:", error);
                    alert('Something went wrong. Please try again.');
                });
        } else {
            alert('Please Select Payment Method!!');
        }
    }

    return (
        <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-md">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-green-600"><i className="fa fa-check-circle"></i> Your Order has been confirmed</h3>
                <h5 className="text-xl mt-2">ORDER ID: {orderId}</h5>
            </div>
            <div className="bg-gray-50 p-6 rounded-md shadow-md">
                <form>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input 
                                type="radio" 
                                id="cod" 
                                name="payMethod" 
                                className="mr-2" 
                                onChange={() => changePaymentMethod('cod')} 
                            />
                            <label htmlFor="cod" className="text-lg">Cash on Delivery (COD)</label>
                        </div>
                        <div className="flex items-center">
                            <input 
                                type="radio" 
                                id="stripe" 
                                name="payMethod" 
                                className="mr-2" 
                                onChange={() => changePaymentMethod('stripe')} 
                            />
                            <label htmlFor="stripe" className="text-lg">Stripe</label>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={payNowButton} 
                        className="w-full mt-6 py-2 px-4 text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Next
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ConfirmOrder;
