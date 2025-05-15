import React from "react";
import { useParams, Link } from "react-router-dom";
import { TiStarFullOutline } from "react-icons/ti";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import Slider from "react-slick"; // For carousel functionality
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//import RelatedProductBox from './RelatedProductBox';
import { useState, useEffect, useContext } from 'react';
import { UserContext, CartContext } from '../../Context';
import ProductBox from '../Products/ProductBox';


const baseUrl = 'http://127.0.0.1:8000/api';


const SellerDetail = () => {
    const [productList, setProductList] = useState([]);
    const [sellerData, setSellerData] = useState({});
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const { seller_username, seller_id } = useParams();
    const userContext = useContext(UserContext);


    useEffect(() => {
        fetchProducts(`${baseUrl}/seller-products/${seller_id}`);
        fetchSeller(`${baseUrl}/seller/${seller_id}`);
    }, []);


    function fetchProducts(url) {
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setProductList(data.results);
                setTotalResults(Math.ceil(data.count / 10)); // Assuming 10 items per page
            })
            .catch((error) => {
                console.error('Failed to fetch data:', error);
            });
    }

    function fetchSeller(url) {
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setSellerData(data);
            })
            .catch((error) => {
                console.error('Failed to fetch data:', error);
            });
    }

    // 🔹 Check if sellerData is null before rendering
    if (!sellerData || !sellerData.user) {
        return <p className="text-center text-gray-500">Loading seller details...</p>;
    }


    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
            {/* Seller Profile Section */}
            <div className="flex items-center gap-6">
                <img
                    src={sellerData.profile_img}
                    alt={sellerData.user.username}
                    className="w-32 h-32 rounded-lg object-cover shadow"
                />
                <div>
                    <h2 className="text-2xl font-bold">
                        {sellerData.user.first_name && sellerData.user.last_name
                            ? `${sellerData.user.first_name} ${sellerData.user.last_name}`
                            : sellerData.user.username}
                    </h2>
                    <p className="text-gray-600">Total Products: {productList.length}</p>
                </div>
            </div>

            {/* Product List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                {productList.map((product, index) => (
                    <ProductBox product={product} key={index} />
                ))}
            </div>
        </div>
    );
};

export default SellerDetail;
