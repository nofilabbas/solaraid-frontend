import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SellerRegister = () => {
  const navigate = useNavigate();
  const baseUrl = 'http://127.0.0.1:8000/api/';
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    mobile: '',
    address: '',
    location: '',
    password: '',
    c_password: '',
    cnic_number: '',
    cnic_front: null,
    cnic_back: null,
    business_doc: null,
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) data.append(key, formData[key]);
    }

    try {
      const response = await axios.post(baseUrl + 'seller/register/', data);
      if (response.data.bool === false) {
        setSuccessMsg('');
        setErrorMsg(response.data.msg);
      } else {
        setErrorMsg('');
        setSuccessMsg(response.data.msg);
        setTimeout(() => {
          navigate('/seller/login');
        }, 2000);
      }
    } catch (error) {
      setErrorMsg('Registration failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-black px-4 py-10">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-primary">Seller Registration</h2>
        {successMsg && <p className="text-green-600 text-center mb-4">{successMsg}</p>}
        {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} className="form-input" />
          <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} className="form-input" />
          <input type="text" name="username" placeholder="Username" onChange={handleChange} className="form-input" />
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} className="form-input" />
          <input type="number" name="mobile" placeholder="Mobile Number" onChange={handleChange} className="form-input" />
          <input type="text" name="address" placeholder="Full Address" onChange={handleChange} className="form-input" />
          <input type="text" name="location" placeholder="City / Location" onChange={handleChange} className="form-input" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="form-input" />
          <input type="password" name="c_password" placeholder="Confirm Password" onChange={handleChange} className="form-input" />
          <input type="number" name="cnic_number" placeholder="CNIC Number" onChange={handleChange} className="form-input" />

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">CNIC Front Image</label>
            <input type="file" name="cnic_front" onChange={handleChange} className="file-input" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">CNIC Back Image</label>
            <input type="file" name="cnic_back" onChange={handleChange} className="file-input" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Business Document (optional)</label>
            <input type="file" name="business_doc" onChange={handleChange} className="file-input" />
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-orange-400 to-black text-white font-semibold rounded-md hover:opacity-90 transition">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerRegister;
