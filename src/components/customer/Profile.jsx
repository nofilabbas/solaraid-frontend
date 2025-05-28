import { Link } from 'react-router-dom';
import logo from '../../logo.svg';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { checkSession } from '../../utils/sessionUtils';

function Profile() {
  const baseUrl = 'http://127.0.0.1:8000/api';
  const [profileData, setProfileData] = useState({
    'user_id': '',
    'first_name': '',
    'last_name': '',
    'username': '',
    'email': '',
    'mobile': '',
    'p_image': '',
  });
  const customerId = sessionStorage.getItem('customer_id');

  useEffect(() => {
    checkSession();
    fetchData(`${baseUrl}/customer/${customerId}`);
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
        setProfileData({
          'user_id': data.user.id,
          'first_name': data.user.first_name,
          'last_name': data.user.last_name,
          'username': data.user.username,
          'email': data.user.email,
          'mobile': data.mobile,
          'p_image': data.profile_img,
        });
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
      });
  }

  const inputHandler = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value
    });
  };

  const fileChangeHandler = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.files[0]
    });
  };

  const submitHandler = (event) => {
    const formData = new FormData();
    formData.append('user', profileData.user_id);
    formData.append('mobile', profileData.mobile);
    formData.append('p_image', profileData.p_image);

    axios.put(baseUrl + '/customer/' + customerId + '/', formData)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    const formUserData = new FormData();
    formUserData.append('first_name', profileData.first_name);
    formUserData.append('last_name', profileData.last_name);
    formUserData.append('username', profileData.username);
    formUserData.append('email', profileData.email);

    axios.put(baseUrl + '/user/' + profileData.user_id + '/', formUserData)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex flex-col lg:flex-row w-full">

        {/* Sidebar */}
        <div className="lg:w-1/4 w-full lg:min-h-screen bg-gradient-to-r from-blue-500 to-emerald-300">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4 w-full py-8 px-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome <span className="text-primary font-extrabold">{profileData.first_name} {profileData.last_name}</span> 👋
          </h3>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
            <h3 className="bg-primary text-white text-lg font-semibold p-5">
              Update Profile
            </h3>
            <div className="p-6 space-y-6">

              {/* Form Starts */}
              <form className="space-y-5">
                {[
                  { label: "First Name", name: "first_name", type: "text" },
                  { label: "Last Name", name: "last_name", type: "text" },
                  { label: "Username", name: "username", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Mobile", name: "mobile", type: "number" }
                ].map(({ label, name, type }) => (
                  <div key={name}>
                    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
                    <input
                      type={type}
                      name={name}
                      id={name}
                      value={profileData[name]}
                      onChange={inputHandler}
                      className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                ))}

                {/* Profile Image */}
                <div>
                  {profileData.p_image && (
                    <img src={profileData.p_image} alt="Profile" className="w-24 h-24 object-cover rounded-full mb-3 border border-gray-300" />
                  )}
                  <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">Profile Image</label>
                  <input
                    type="file"
                    name="p_image"
                    id="profileImage"
                    onChange={fileChangeHandler}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={submitHandler}
                  className="py-2 px-6 bg-primary text-white rounded-md font-semibold hover:bg-primary/80 transition duration-200 w-fit mx-auto block"
                >
                  Submit
                </button>
              </form>
              {/* Form Ends */}

            </div>
          </div>
        </div>
      </div>
    </div>


  );
}

export default Profile;
