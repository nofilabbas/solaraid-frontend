import { useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';

function AddAddress() {
    const baseUrl = 'http://127.0.0.1:8000/api';
    const customerId = localStorage.getItem('customer_id');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [addressFormData, setAddressFormData] = useState({
        'address': '',
        'customer': customerId,
    });

    const inputHandler = (event) => {
        setAddressFormData({
            ...addressFormData,
            [event.target.name]: event.target.value
        });
    };

    const submitHandler = (event) => {
        const formData = new FormData();
        formData.append('address', addressFormData.address);
        formData.append('customer', addressFormData.customer);

        console.log('FormData before submission:', formData);

        axios.post(baseUrl + '/address/', formData)
            .then(function (response) {
                if (response.status === 201) {
                    setErrorMsg('');
                    setSuccessMsg('Data saved successfully!!');
                } else {
                    setErrorMsg('Data not saved!!');
                    setSuccessMsg('');
                    setAddressFormData({
                        'address': ''
                    });
                }
            })
            .catch(function (error) {
                console.error('Error:', error.response?.data || error.message);
            });
    };

    const disableBtn = (addressFormData.address === '');
    
    return (
        <div className="container mx-auto mt-6">
            <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/4 w-full mb-4">
                    <Sidebar />
                </div>
                <div className="lg:w-3/4 w-full">
                    <div className="bg-white shadow-md rounded-lg">
                        <h3 className="bg-gray-800 text-white text-lg font-semibold p-4 rounded-t-lg">Add Address</h3>
                        <div className="p-6">
                            {errorMsg && <p className="alert alert-danger text-red-600 font-semibold mb-4">{errorMsg}</p>}
                            {successMsg && <p className="alert alert-success text-green-600 font-semibold mb-4">{successMsg}</p>}
                            <div className="mb-4">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Enter address below</label>
                                <textarea
                                    className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    name="address"
                                    onChange={inputHandler}
                                    value={addressFormData.address}
                                    id="address"
                                    placeholder="Enter your address"
                                ></textarea>
                            </div>
                            <button
                                type="button"
                                disabled={disableBtn}
                                onClick={submitHandler}
                                className={`w-full py-2 px-4 text-white rounded-md font-semibold ${disableBtn ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                Add Address
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddAddress;
    