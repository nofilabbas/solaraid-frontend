import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import axios from 'axios';

function AddressList() {
    const baseUrl = 'http://127.0.0.1:8000/api';
    const customerId = localStorage.getItem('customer_id');
    const [addressList, setAddressList] = useState([]);

    useEffect(() => {
        fetchData(`${baseUrl}/customer/${customerId}/address-list`);
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
                console.log(data.results);
                setAddressList(data.results);
            })
            .catch((error) => {
                console.error('Failed to fetch data:', error);
            });
    }

    function defaultButtonHandler(address_id) {
        const formData = new FormData();
        formData.append('address_id', address_id);

        axios.post(baseUrl + '/mark-default-address/' + parseInt(address_id) + '/', formData)
            .then(function (response) {
                if (response.data.bool === true) {
                    window.location.reload();
                }
            })
            .catch(function (error) {
                console.error('Error:', error.response?.data || error.message);
            });
    }

    return (
        <div className="container mx-auto">
        <div className="min-h-screen flex flex-col lg:flex-row gap-4">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <Sidebar />
          </div>
      
          {/* Main Address Content */}
          <div className="w-full lg:w-3/4 p-4">
            {/* Add Address Button */}
            <div className="flex justify-end mb-4">
              <Link
                to="/customer/add-address"
                className="inline-flex items-center bg-green-500 text-white text-sm px-4 py-2 rounded-md shadow hover:bg-green-600 transition"
              >
                <i className="fa fa-plus-circle mr-2"></i> Add Address
              </Link>
            </div>
      
            {/* Address Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {addressList.map((address) => (
                <div key={address.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h6 className="font-semibold text-gray-800 mb-1">
                        <Link to={`/customer/update-address/${address.id}`} className="hover:text-blue-600 transition">
                          {address.address}
                        </Link>
                      </h6>
                      {/* <p className="text-gray-600 text-sm">City: {address.city}</p> */}
                    </div>
                    <div>
                      {address.default_address ? (
                        <i className="fa fa-check-circle text-green-500 text-lg" title="Default address"></i>
                      ) : (
                        <button onClick={() => defaultButtonHandler(address.id)} title="Set as default">
                          <i className="far fa-check-circle text-gray-400 text-lg hover:text-green-500 transition"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    );
}

export default AddressList;
