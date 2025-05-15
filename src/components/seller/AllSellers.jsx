import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const baseUrl = "http://127.0.0.1:8000/api";

const AllSellers = () => {
    const [sellers, setSellers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetch(`${baseUrl}/sellers/?page=${currentPage}`)
            .then((response) => response.json())
            .then((data) => {
                setSellers(data.results);
                setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 per page
            })
            .catch((error) => console.error("Error fetching sellers:", error));
    }, [currentPage]);
    

    return (
        <div className="mt-14 mb-12 flex justify-center">
            <div className="container">
                <div className="text-center mb-8 max-w-[600px] mx-auto">
                    <h1 className="text-4xl font-bold">All Sellers</h1>
                </div>

                {/* Seller List */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                    {sellers.map((seller) => (
                        <div key={seller.id} className="shadow-lg p-4 rounded-lg text-center">
                            <Link to={`/seller/${seller.user.username}/${seller.id}`}>
                                <img src={seller.profile_img} alt={seller.user.username} className="w-60 h-60 rounded-lg mx-auto" />
                            </Link>
                            <h3 className="text-lg font-semibold mt-2">
                                <Link to={`/seller/${seller.user.username}/${seller.id}`}>{seller.user.username}</Link>
                            </h3>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`mx-1 px-4 py-2 rounded ${currentPage === i + 1
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllSellers;
