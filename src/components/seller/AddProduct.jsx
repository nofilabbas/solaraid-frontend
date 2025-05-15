import SellerSidebar from './SellerSidebar';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/api';

function AddProduct() {
    const seller_id = localStorage.getItem('seller_id');
    const [categoryData, setCategoryData] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [productData, setProductData] = useState({
        category: '',
        seller: seller_id,
        title: '',
        detail: '',
        price: '',
        slug: '',
        tags: '',
        image: '',
    });
    const [imageUploadErrorMsg, setImageUploadErrorMsg] = useState('');
    const [imageUploadSuccessMsg, setImageUploadSuccessMsg] = useState('');
    const featuredImageRef = useRef(null);
    const productImagesRef = useRef(null);
    const [productsImgs, setProductsImgs] = useState([]);

    useEffect(() => {
        fetchData(`${baseUrl}/categories/`);
    }, []);

    function fetchData(url) {
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setCategoryData(data.results);
            })
            .catch((error) => {
                console.error('Failed to fetch data:', error);
            });
    }

    const inputHandler = (event) => {
        setProductData({
            ...productData,
            [event.target.name]: event.target.value,
        });
    };

    const fileChangeHandler = (event) => {
        setProductData({
            ...productData,
            [event.target.name]: event.target.files[0],
        });
    };

    const multipleImagesHandler = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            setProductsImgs(files);
        }
    };

    const submitHandler = () => {
        const formData = new FormData();
        formData.append('category', productData.category);
        formData.append('seller', productData.seller);
        formData.append('title', productData.title);
        formData.append('detail', productData.detail);
        formData.append('price', productData.price);
        formData.append('slug', productData.slug);
        formData.append('tags', productData.tags);
        formData.append('image', productData.image);

        axios
            .post(`${baseUrl}/products/`, formData)
            .then((response) => {
                if (response.status === 201) {
                    setSuccessMsg('Product added successfully!');
                    setErrorMsg('');

                    for (let i = 0; i < productsImgs.length; i++) {
                        const imageFormData = new FormData();
                        imageFormData.append('product', response.data.id);
                        imageFormData.append('image', productsImgs[i]);

                        axios
                            .post(`${baseUrl}/product-imgs/`, imageFormData)
                            .then(() => {
                                setImageUploadSuccessMsg('Images uploaded successfully!');
                            })
                            .catch(() => {
                                setImageUploadErrorMsg('Error uploading images.');
                            });
                    }

                    setProductsImgs([]);
                    setProductData({
                        category: '',
                        seller: seller_id,
                        title: '',
                        detail: '',
                        price: '',
                        slug: '',
                        tags: '',
                        image: '',
                    });

                    if (featuredImageRef.current) {
                        featuredImageRef.current.value = '';
                    }
                    if (productImagesRef.current) {
                        productImagesRef.current.value = '';
                    }
                } else {
                    setErrorMsg('Failed to add product.');
                    setSuccessMsg('');
                }
            })
            .catch((error) => {
                console.error(error);
                setErrorMsg('An error occurred while adding the product.');
            });
    };

    return (
        <div className="min-h-screen container mx-auto mt-0">
            <div className="grid grid-cols-12 gap-4 min-h-screen">
                {/* Seller Sidebar */}
                <div className="col-span-12 md:col-span-3">
                    <SellerSidebar />
                </div>

                <div className="col-span-12 md:col-span-9 py-8">
                    <h2 className="text-2xl font-bold text-center mb-4">Add Product</h2>
                    {successMsg && <p className="text-green-500 text-center mb-2">{successMsg}</p>}
                    {errorMsg && <p className="text-red-500 text-center mb-2">{errorMsg}</p>}
                    {imageUploadSuccessMsg && <p className="text-green-500 text-center mb-2">{imageUploadSuccessMsg}</p>}
                    {imageUploadErrorMsg && <p className="text-red-500 text-center mb-2">{imageUploadErrorMsg}</p>}

                    <form className="space-y-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                name="category"
                                onChange={inputHandler}
                            >
                                <option value="">Select a category</option>
                                {categoryData.map((item, index) => (
                                    <option key={index} value={item.id}>{item.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                name="title"
                                value={productData.title}
                                onChange={inputHandler}
                                placeholder="Enter product title"
                            />
                        </div>

                        <div>
                            <label htmlFor="detail" className="block text-sm font-medium text-gray-700">Detail</label>
                            <textarea
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                name="detail"
                                value={productData.detail}
                                onChange={inputHandler}
                                placeholder="Enter product details"
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                name="price"
                                value={productData.price}
                                onChange={inputHandler}
                                placeholder="Enter product price"
                            />
                        </div>

                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                            <input
                                type="text"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                name="slug"
                                value={productData.slug}
                                onChange={inputHandler}
                                placeholder="Enter product slug"
                            />
                        </div>

                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
                            <input
                                type="text"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                name="tags"
                                value={productData.tags}
                                onChange={inputHandler}
                                placeholder="Enter product tags"
                            />
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Featured Image</label>
                            <input
                                type="file"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                name="image"
                                ref={featuredImageRef}
                                onChange={fileChangeHandler}
                            />
                        </div>

                        <div>
                            <label htmlFor="productImgs" className="block text-sm font-medium text-gray-700">Product Images</label>
                            <input
                                type="file"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                multiple
                                name="productImgs"
                                ref={productImagesRef}
                                onChange={multipleImagesHandler}
                            />
                        </div>
                        <div className="flex justify-start mt-4">
                            {/* <button
                                type="button"
                                className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                                onClick={submitHandler}
                            >
                                Update Product
                            </button> */}
                            <button
                                type="button"
                                onClick={submitHandler}
                                className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                Add Product
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;
