import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const baseUrl = "http://127.0.0.1:8000/api";

const AllCategories = () => {
    const [categories, setCategories] = useState([]); // Change sellers to categories
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetch(`${baseUrl}/categories/?page=${currentPage}`) // Fetch categories instead of sellers
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setCategories(data.results); // Set categories data
                setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 per page
            })
            .catch((error) => console.error("Error fetching categories:", error));
    }, [currentPage]);

    return (
        <div className="mt-14 mb-12">
            <div className="container">
                <div className="text-center mb-8 max-w-[600px] mx-auto">
                    <h1 className="text-4xl font-bold">All Categories</h1> {/* Changed to Categories */}
                </div>

                {/* Category List */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                    {categories.map((category) => (
                        <div key={category.id} className="shadow-lg p-4 rounded-lg text-center">
                            <Link to={`/category/${category.title}/${category.id}`}> {/* Category link URL */}
                                <img
                                    src={category.cat_img} // Assuming category has an image field
                                    alt={category.title} // Assuming category has a name
                                    className="w-60 h-60 rounded-lg mx-auto"
                                />
                            </Link>
                            <h3 className="text-lg font-semibold mt-2">
                                <Link to={`/category/${category.title}/${category.id}`}>{category.title}</Link> {/* Display category name */}
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

export default AllCategories;
