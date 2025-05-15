import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const baseUrl = 'http://127.0.0.1:8000/api';

const TopSellers = () => {
    const [sellers, setSellers] = useState([]);

    useEffect(() => {
        fetchTopSellers();
    }, []);

    const fetchTopSellers = async () => {
        try {
            const response = await fetch(`${baseUrl}/sellers/?fetch_limit=3`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSellers(data.results);
        } catch (error) {
            console.error('Failed to fetch top sellers:', error);
        }
    };

    return (
        <div className="mt-14 mb-12 flex justify-center">
            <div className="container">
                <div className="text-center mb-10 max-w-[600px] mx-auto">
                    <p className="text-md text-primary">Top Sellers</p>
                    <h1 className="text-4xl font-bold">Best Sellers</h1>
                    <p className="text-sm text-gray-400">Discover our top-rated sellers.</p>
                </div>

                {/* Sellers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {sellers.length > 0 ? (
                        sellers.map((seller) => (
                            <div key={seller.id} className="bg-white shadow-md rounded-lg p-4 text-center">
                                <Link to={`/seller/${seller.user.username}/${seller.id}`}>
                                <img
                                    src={seller.profile_img}
                                    alt={seller.user.username}
                                    className="w-48 h-48 mx-auto rounded-full object-cover"
                                />
                                </Link>
                                <h2 className="text-lg font-bold mt-2">
                                    <Link to={`/seller/${seller.user.username}/${seller.id}`}>{seller.user.username}</Link>
                                    </h2>
                            </div>
                        ))
                    ) : (
                        <p>No sellers available.</p>
                    )}
                </div>

                {/* Show All Button */}
                <div className="text-center mt-8">
                    <Link to="/sellers">
                        <button className="bg-primary text-white py-2 px-5 rounded-md hover:bg-white hover:text-primary border-2 border-transparent hover:border-primary transition duration-300">
                            SHOW ALL
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TopSellers;
