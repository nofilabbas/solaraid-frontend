import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { TiStarFullOutline } from "react-icons/ti";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import Slider from "react-slick"; // For carousel functionality
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//import RelatedProductBox from './RelatedProductBox';
import { useState, useEffect, useContext } from 'react';
import { UserContext, CartContext } from '../../Context';
import axios from "axios";
import Chat from "../Chatbox/Chat";


export const baseUrl = 'http://127.0.0.1:8000/api';


const ProductDetail = () => {
  const [productData, setProductData] = useState({});
  const [productImgs, setProductImgs] = useState([]);
  const [productTags, setProductTags] = useState([]);
  const [cartButtonClickStatus, setCartButtonClickStatus] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { product_slug, product_id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState([]);
  const [averageRating, setAverageRating] = useState([]);
  const { cartData, setCartData } = useContext(CartContext);
  const userContext = useContext(UserContext);
  var customerId = localStorage.getItem('customer_id');
  const [productInWishlist, setProductInWishlist] = useState(false);
  const [ReviewFormData, setReviewFormData] = useState({
    review: "",
    rating: 1,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chatSellerId, setChatSellerId] = useState(null);


  useEffect(() => {
    fetchData(`${baseUrl}/product/${product_id}`);
    fetchRelatedData(`${baseUrl}/related-products/${product_id}`);
    checkProductInCart(product_id);
    checkProductInWishlist(baseUrl + '/check-in-wishlist/', product_id);
    fetchReviews(product_id);

    if (customerId && product_id) {
      fetch(`${baseUrl}/record_interaction/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          product_id: product_id,
          interaction_type: 'view',
        }),
      });
    }

  }, [currentPage, product_id]);


  function checkProductInCart(product_id) {
    const previousCart = localStorage.getItem('cartData');
    const cartJson = previousCart ? JSON.parse(previousCart) : [];
    const productInCart = cartJson.some(cart => cart?.product?.id === parseInt(product_id));

    setCartButtonClickStatus(productInCart); // Update button state based on product presence
  }

  function fetchData(url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProductData(data);
        setProductImgs(data.product_imgs);
        setProductTags(data.tag_list);
        setTotalResults(Math.ceil(data.count / 10)); // Assuming 10 items per page
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
      });
  }

  function fetchRelatedData(url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setRelatedProducts(data.results);
        setTotalResults(Math.ceil(data.count / 1)); // Assuming 10 items per page
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
      });
  }

  function fetchReviews(productId) {
    fetch(`http://127.0.0.1:8000/api/product-reviews/${productId}/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setReviews(data.reviews);
        setAverageRating(data.average_rating);
        setTotalReviews(data.total_reviews);

      })
      .catch((error) => console.error("Failed to fetch reviews:", error));
  }


  const tagLinks = productTags.map((tag, index) => {
    let tagTrimmed = tag.trim();
    return (
      <Link
        key={index}
        className="bg-yellow-500 text-white px-3 py-1 rounded-full hover:bg-yellow-600 transition duration-300"
        to={`/products/${tagTrimmed}`}
      >
        {tagTrimmed}
      </Link>
    );
  });

  // Handle Input Changes
  const inputHandler = (event) => {
    setReviewFormData({
      ...ReviewFormData,
      [event.target.name]: event.target.value,
    });
  };

  // Handle Star Rating Click
  const handleStarClick = (rating) => {
    setReviewFormData({ ...ReviewFormData, rating });
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

        // Refresh reviews
        fetchReviews(product_id);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const cartAddButtonHandler = () => {
    const previousCart = localStorage.getItem('cartData');
    const cartJson = previousCart ? JSON.parse(previousCart) : [];

    const newProduct = {
      product: {
        id: productData.id,
        title: productData.title,
        price: productData.price,
        image: productData.image,
      },
      quantity: 1,
      user: { id: 1 },
    };

    cartJson.push(newProduct); // Add new product to cart
    localStorage.setItem('cartData', JSON.stringify(cartJson));
    setCartData(cartJson);
    setCartButtonClickStatus(true); // Update button state
  };

  const cartRemoveButtonHandler = () => {
    const previousCart = localStorage.getItem('cartData');
    let cartJson = previousCart ? JSON.parse(previousCart) : [];

    // Filter out the product to be removed
    cartJson = cartJson.filter(cart => cart?.product?.id !== productData.id);
    if (cartJson.length === 0) {
      localStorage.removeItem('cartData');
    } else {
      // Otherwise, update 'cartData' in localStorage
      localStorage.setItem('cartData', JSON.stringify(cartJson));
    }
    setCartData(cartJson);
    setCartButtonClickStatus(false); // Update button state
  }


  function addToWishlistHandler() {
    const customerId = localStorage.getItem('customer_id');
    const formData = new FormData();
    formData.append('customer', customerId);
    formData.append('product', productData.id);

    // Log FormData content by iterating over its entries
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    //Submit Data
    axios.post(baseUrl + '/wishlist/', formData)
      .then(function (response) {
        if (response.data.id) {
          setProductInWishlist(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function checkProductInWishlist(baseurl, product_id) {
    const customerId = localStorage.getItem('customer_id');
    const formData = new FormData();
    formData.append('customer', customerId);
    formData.append('product', product_id);

    // Log FormData content by iterating over its entries
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    //Submit Data
    if (customerId) {
      axios.post(baseurl, formData)
        .then(function (response) {
          if (response.data.bool == true) {
            setProductInWishlist(true);
          } else {
            setProductInWishlist(false);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  // Function to navigate to the chat page with the seller
  const initiateChatWithSeller = () => {
    // Assuming the productData contains the sellerId, you can extract it here.
    const sellerId = productData.seller; // Assuming this is the key for the seller's ID
    if (sellerId) {
      setChatSellerId(sellerId);
      setShowChat(true);
    }
  };

  // Combine main product image and additional images
  const allImages = [productData.image, ...productImgs.map(img => img.image)];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3500,
    slidesToShow: 1, // Show only one image at a time
    slidesToScroll: 1,
    arrows: true, // Enable navigation arrows
  };

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768, // For smaller screens
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480, // For mobile screens
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      {/* Product Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Product Image Slider */}
        <div className="w-full max-w-2xl mx-auto relative">
          <Slider {...settings}>
            {allImages.map((img, index) => (
              <div key={index} className="px-1">
                <img
                  src={img}
                  alt={`Product Image ${index + 1}`}
                  className="w-full h-[400px] object-contain rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{productData.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <TiStarFullOutline className="text-yellow-400" />
            <span className="text-lg font-bold">
              {averageRating ? averageRating : "No Ratings Yet"}
            </span>
            {totalReviews > 0 && (
              <>
                <span class="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                <span className="text-lg">{totalReviews} reviews</span>
              </>
            )}
          </div>
          <p className="text-2xl font-bold text-green-600">
            Rs {productData.price}
            <span className="text-gray-400 text-lg ml-2 line-through">
              Rs 100
            </span>
          </p>
          <p className="mt-4 text-gray-600">
            {productData.detail}
          </p>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            {
              userContext && <>
                {!cartButtonClickStatus ? (
                  <button onClick={cartAddButtonHandler} className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition duration-300 flex items-center gap-2">
                    <AiOutlineShoppingCart size={20} /> Add to Cart
                  </button>
                ) : (
                  <button onClick={cartRemoveButtonHandler} className="bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-600 transition duration-300 flex items-center gap-2">
                    <AiOutlineShoppingCart size={20} /> Remove from Cart
                  </button>
                )}
                <button className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300 flex items-center gap-2">
                  <AiOutlineHeart size={20} /> Buy Now
                </button>
              </>
            }
            {/* {
              (userContext && !productInWishlist) && <button onClick={addToWishlistHandler} className="bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 transition duration-300 flex items-center gap-2">
                <AiOutlineHeart size={20} /> Add to Wishlist
              </button>
            }
            {
              (userContext && productInWishlist) && <button onClick={addToWishlistHandler} className=" bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 transition duration-300 flex items-center gap-2">
                <AiOutlineHeart size={20} /> Add to Wishlist
              </button>
            } */}
            {
              userContext && <>
                {!productInWishlist ? (
                  <button onClick={addToWishlistHandler} className=" bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 transition duration-300 flex items-center gap-2">
                    <AiOutlineHeart size={20} /> Add to Wishlist
                  </button>
                ) : (
                  <button disabled onClick={addToWishlistHandler} className="bg-gray-200 text-gray-700 py-2 px-6 rounded-md cursor-not-allowed transition duration-300 flex items-center gap-2">
                    <AiOutlineHeart size={20} /> Already in Wishlist
                  </button>
                )}
              </>
            }

          </div>
          {/* Product Tags */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Tags</h2>
            <div className="flex gap-3 flex-wrap">
              {tagLinks}
            </div>

            {/* Chat Button */}
            {
              userContext &&
              <div className="mt-6">
                <button
                  onClick={initiateChatWithSeller}
                  className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Chat with Seller
                </button>
                {/* Floating Chat */}
                {showChat && (
                  <Chat receiverId={chatSellerId} onClose={() => setShowChat(false)} />
                )}
              </div>
            }
          </div>

          {/* Back to Products */}
          <div className="mt-6">
            <Link to="/products" className="text-blue-500 hover:underline">
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>


        {/* Add Review Form */}
        {
          customerId && <div className="border p-6 rounded-lg shadow-lg bg-gray-100 mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Write your Review</h3>
            {successMsg && <p className="text-green-500 text-center mb-2">{successMsg}</p>}
            {errorMsg && <p className="text-red-500 text-center mb-2">{errorMsg}</p>}

            <div className="mb-4">
              <label htmlFor="review" className="block text-gray-700 font-medium mb-2">
                Your Review:
              </label>
              <textarea
                className="w-[70%] border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows="3"
                placeholder="Share your experience..."
                value={ReviewFormData.review}
                name="review"
                id="review"
                onChange={inputHandler}
              />
            </div>

            {/* Star Rating */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Rating:</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <TiStarFullOutline
                    key={num}
                    className={`text-2xl cursor-pointer ${num <= ReviewFormData.rating ? "text-yellow-500" : "text-gray-400"
                      }`}
                    onClick={() => handleStarClick(num)}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={submitHandler}
              disabled={!ReviewFormData.review}
              className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Review
            </button>
          </div>
        }



        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="border-b py-4 flex gap-4 items-center">
              {/* Customer Image */}
              <img
                src={review.customer?.profile_img || "/default-profile.png"}
                alt={review.customer?.user?.username}
                className="w-12 h-12 object-cover rounded-full border border-gray-300"
              />

              {/* Review Content */}
              <div>
                <p className="font-semibold">{review.customer?.user?.first_name} {review.customer?.user?.last_name}</p>
                <div className="flex items-center text-yellow-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <TiStarFullOutline key={i} />
                  ))}
                </div>
                <p className="text-gray-600">{review.review}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>


      {/* Related Products Section */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-6">Related Products</h2>
        <Slider {...carouselSettings}>
          {relatedProducts
            .map((relatedProduct) => (
              <div key={relatedProduct.id} className="p-4">
                <Link to={`/product/${relatedProduct.slug}/${relatedProduct.id}`}>
                  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <img
                      src={relatedProduct.image} // Adjust according to your API structure
                      alt={relatedProduct.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold">{relatedProduct.title}</h3>
                      <p className="text-sm text-gray-600">
                        Rs {relatedProduct.price}{" "}
                        {relatedProduct.oldPrice && (
                          <span className="text-gray-400 line-through">
                            Rs {relatedProduct.oldPrice}
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <TiStarFullOutline className="text-yellow-400" />
                        <span className="text-sm">{relatedProduct.average_rating} / 5</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

        </Slider>
      </div>
    </div>
  );
};

export default ProductDetail;
