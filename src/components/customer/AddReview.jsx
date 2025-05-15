import Sidebar from './Sidebar';
import { useState } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
const baseUrl = 'http://127.0.0.1:8000/api';
function AddReview() {
    const { product_id } = useParams();
    var customer_id = localStorage.getItem('customer_id');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [ReviewFormData, setReviewFormData] = useState({
        'review': '',
        'rating': 1
    });

    const inputHandler = (event) => {
        setReviewFormData({
            ...ReviewFormData,
            [event.target.name]: event.target.value
        });
    };


   // Submit Review
  const submitHandler = async () => {
    const formData = new FormData();
    formData.append("review", ReviewFormData.review);
    formData.append("rating", ReviewFormData.rating);
    const customerId = localStorage.getItem('customer_id'); // Always string
    const customerIdNumber = Number(customerId); // Convert if necessary
    formData.append("customer_id", customerIdNumber.toString());
    formData.append("product", product_id);
    formData.forEach((value, key) => {
    console.log(key, value);
});

    try {
      const response = await axios.post(`${baseUrl}/productrating/`, formData);
      if (response.status !== 201) {
        setErrorMsg("Review could not be submitted.");
        setSuccessMsg("");
      } else {
        setErrorMsg("");
        setSuccessMsg("Your review has been submitted!");
        setReviewFormData({ review: "", rating: 1 });

      }
    } catch (error) {
      console.log(error);
    }
  };

    return (
        <div className="container mx-auto mt-8">
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/4 mb-4">
                    <Sidebar />
                </div>
                <div className="w-full md:w-3/4">
                    <div className="bg-white shadow-md rounded-lg p-4 max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Add a Review</h2>
                        {successMsg && <p className="text-green-500 text-center mb-2">{successMsg}</p>}
                        {errorMsg && <p className="text-red-500 text-center mb-2">{errorMsg}</p>}
                        <div className="mb-4">
                            <label for='review' className="block text-gray-700 font-medium mb-2">Your Review:</label>
                            <textarea
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                rows="4"
                                placeholder="Write your review here..."
                                value={ReviewFormData.review}
                                name='review'
                                id='review'
                                onChange={inputHandler}
                            />
                        </div>
                        <div className="mb-4">
                            <label for='rating' className="block text-gray-700 font-medium mb-2">Rating:</label>
                            <select
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={ReviewFormData.rating}
                                name='rating'
                                id='rating'
                                onChange={inputHandler}
                            >
                                <option value="">Select a rating</option>
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!ReviewFormData.review || !ReviewFormData.rating}
                            onClick={submitHandler}
                        >
                            Add Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddReview;

