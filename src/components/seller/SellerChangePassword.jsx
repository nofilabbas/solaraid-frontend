import axios from 'axios';
import SellerSidebar from './SellerSidebar';
import { useState } from 'react';

function ChangePassword() {
    const baseUrl = 'http://127.0.0.1:8000/api';
    const sellerId = localStorage.getItem('seller_id');
    const [passwordData, setPasswordData] = useState({
        'password': '',
        'c_password': ''
    });
    const [confirmError, setConfirmError] = useState(false);

    const inputHandler = (event) => {
        setPasswordData({
            ...passwordData,
            [event.target.name]: event.target.value
        });
    };

    const submitHandler = (event) => {
        event.preventDefault(); // Prevent the form from submitting normally
        if (passwordData.password === passwordData.c_password) {
            setConfirmError(false);
        } else {
            setConfirmError(true);
        }
        
        const formData = new FormData();
        formData.append('password', passwordData.password);

        axios.post(baseUrl + '/seller-change-password/' + sellerId + '/', formData)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <div className="container mx-auto">
  <div className="flex flex-col lg:flex-row">
    {/* Sidebar */}
    <div className="w-full lg:w-1/4">
      <SellerSidebar />
    </div>

    {/* Main Content */}
    <div className="w-full lg:w-3/4 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Change Password</h3>

      {confirmError && (
        <p className="text-red-500 text-center mb-4">Password does not match!</p>
      )}

      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={passwordData.password}
            onChange={inputHandler}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            name="c_password"
            id="confirmPassword"
            value={passwordData.c_password}
            onChange={inputHandler}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          className="mt-4 py-2 px-6 bg-primary text-white rounded-md font-semibold hover:bg-primary/80 transition duration-200 mx-auto block"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
</div>

    );
}

export default ChangePassword;
