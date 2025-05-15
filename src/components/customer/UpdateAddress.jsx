import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function UpdateAddress() {
  const { address_id } = useParams();
  const baseUrl = 'http://127.0.0.1:8000/api';
  const customerId = localStorage.getItem('customer_id');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [addressFormData, setAddressFormData] = useState({
    address: '',
    customer: customerId,
  });

  useEffect(() => {
    fetchData(`${baseUrl}/address/${address_id}`);
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
        setAddressFormData({
          address: data.address,
          customer: customerId,
        });
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
      });
  }

  const inputHandler = (event) => {
    setAddressFormData({
      ...addressFormData,
      [event.target.name]: event.target.value,
    });
  };

  const submitHandler = (event) => {
    const formData = new FormData();
    formData.append('address', addressFormData.address);
    formData.append('customer', addressFormData.customer);

    axios
      .put(baseUrl + '/address/' + parseInt(address_id) + '/', formData)
      .then(function (response) {
        if (response.status === 200) {
          setErrorMsg('');
          setSuccessMsg('Data saved successfully!!');
        } else {
          setErrorMsg('Data not saved!!');
          setSuccessMsg('');
        }
      })
      .catch(function (error) {
        console.error('Error:', error.response?.data || error.message);
      });
  };

  const disableBtn = addressFormData.address === '';

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4">
        <Sidebar />
      </div>

      {/* Content */}
      <div className="w-3/4 p-8 bg-white shadow-lg">
        <h3 className="text-xl font-semibold mb-6 text-center">Update Address</h3>

        {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}
        {successMsg && <p className="text-green-500 text-center mb-4">{successMsg}</p>}

        <div className="mb-4">
          <label htmlFor="address" className="block text-lg font-medium text-gray-700">
            Enter address below
          </label>
          <textarea
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            name="address"
            onChange={inputHandler}
            value={addressFormData.address}
            id="address"
            placeholder="Enter your address"
          />
        </div>

        <button
          type="button"
          disabled={disableBtn}
          onClick={submitHandler}
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Update Address
        </button>
      </div>
    </div>
  );
}

export default UpdateAddress;
