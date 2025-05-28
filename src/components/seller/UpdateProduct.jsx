import SellerSidebar from './SellerSidebar';
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineDelete } from "react-icons/ai";
import { checkSession } from '../../utils/sessionUtils';


const baseUrl = 'http://127.0.0.1:8000/api';
function UpdateProduct() {
    const { product_id } = useParams();
    const seller_id = sessionStorage.getItem('seller_id');
    const [categoryData, setCategoryData] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [productData, setProductData] = useState({
        'category': '',
        'seller': seller_id,
        'title': '',
        'detail': '',
        'price': '',
        'slug': '',
        'tags': '',
        'inventory': '',
        'image': '',
        'product_imgs': [],
    });
    const [imageUploadErrorMsg, setImageUploadErrorMsg] = useState('');
    const [imageUploadSuccessMsg, setImageUploadSuccessMsg] = useState('');
    const featuredImageRef = useRef(null);
    const productImagesRef = useRef(null);
    const [isFeatureImageSelected, setIsFeatureImageSelected] = useState(false);
    const [isProductImagesSelected, setIsProductImagesSelected] = useState(false);
    const [productsImgs, setproductImgs] = useState([]);

    useEffect(() => {
        checkSession('seller');
        fetchData(`${baseUrl}/categories/`);
        fetchProductData(`${baseUrl}/product/${product_id}`);
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

    function fetchProductData(url) {
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setProductData({
                    'category': data.category,
                    'seller': data.seller,
                    'title': data.title,
                    'detail': data.detail,
                    'price': data.price,
                    'slug': data.slug,
                    'tags': data.tags,
                    'inventory': data.inventory,
                    'image': data.image,
                    'product_imgs': data.product_imgs,
                })
            })
            .catch((error) => {
                console.error('Failed to fetch data:', error);
            });
    }

    const inputHandler = (event) => {
        setProductData({
            ...productData,
            [event.target.name]: event.target.value
        })
    };

    const fileChangeHandler = (event) => {
        setProductData({
            ...productData,
            [event.target.name]: event.target.files[0]
        })
        if (event.target.name == 'image') {
            setIsFeatureImageSelected(true);
        }
    };

    const multipleImagesHandler = (event) => {
        var files = event.target.files;
        if (files.length > 0) {
            setIsProductImagesSelected(true);
            setproductImgs(files);
        }
    }

    function deleteImage(image_id) {
        axios.delete(baseUrl + '/product-img/' + image_id + '/')
            .then(function (response) {
                if (response.status == 204) {
                    window.location.reload();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const styles = {
        'deleteBtn': {
            'position': 'absolute'
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
        formData.append('inventory', productData.inventory);
        if (isFeatureImageSelected) {
            formData.append('image', productData.image);
        }

        axios.patch(baseUrl + '/product/' + product_id + '/', formData)
            .then(function (response) {
                if (response.status == 200) {
                    setSuccessMsg(response.statusText);
                    setErrorMsg('');

                    //submit multiple images
                    if (isProductImagesSelected) {
                        for (let i = 0; i < productsImgs.length; i++) {
                            const imageFormData = new FormData();
                            imageFormData.append('product', response.data.id);
                            imageFormData.append('image', productsImgs[i]);

                            axios.post(baseUrl + '/product-imgs/', imageFormData)
                                .then(function (response) {
                                    setImageUploadSuccessMsg('Images uploaded successfully!');
                                })
                                .catch(function (error) {
                                    setImageUploadErrorMsg('Error uploading images.');
                                });
                        }
                        setproductImgs([]);
                    }
                } else {
                    setErrorMsg(response.statusText);
                    setSuccessMsg('');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className="flex">
            <div className="w-1/4">
                {/* Seller Sidebar */}
                <SellerSidebar />
            </div>
            <div className="w-3/4 p-6">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-4">Update Product</h2>
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
                                value={productData.category}
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
                            <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">Inventory</label>
                            <input
                                type="number"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                name="inventory"
                                value={productData.inventory}
                                onChange={inputHandler}
                                placeholder="Enter number of products"
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
                            <img src={productData.image} className='img rounded border mt-2' width='200' />
                        </div>

                        <div>
                            <label htmlFor="product_imgs" className="block text-sm font-medium text-gray-700">Product Images</label>
                            <input
                                type="file"
                                multiple
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                name="product_imgs"
                                ref={productImagesRef}
                                onChange={multipleImagesHandler}
                            />
                            {
                                productData.product_imgs && productData.product_imgs.map((img, index) =>
                                    <span
                                        className="relative inline-block p-3 mt-2"

                                        key={index}
                                    >
                                        <AiOutlineDelete onClick={() => deleteImage(img.id)}
                                            role="button" className="text-dark-400 cursor-pointer" /> <i className="fa fa-trash text-gray-800 absolute top-2 right-2"></i>
                                        <img src={img.image} alt="Product" className="my-4 w-48" />
                                    </span>
                                )
                            }
                        </div>

                        <div className="flex justify-start mt-4">
                            <button
                                type="button"
                                className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary"
                                onClick={submitHandler}
                            >
                                Update Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default UpdateProduct;
