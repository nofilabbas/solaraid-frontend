import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import axios from 'axios';

const RegisterPage = () => {
    const navigate = useNavigate();
    const baseUrl = 'http://127.0.0.1:8000/api/';
    const [formError, setFormError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [registerFormData, setRegisterFormData] = useState({
        'first_name': '',
        'last_name': '',
        'username': '',
        'email': '',
        'mobile': '',
        'password': '',
        'c_password': ''
    });

    const inputHandler = (event) => {
        setRegisterFormData({
            ...registerFormData,
            [event.target.name]: event.target.value
        });
    };

    const submitHandler = (event) => {
        const formData = new FormData();
        formData.append('first_name', registerFormData.first_name);
        formData.append('last_name', registerFormData.last_name);
        formData.append('username', registerFormData.username);
        formData.append('email', registerFormData.email);
        formData.append('mobile', registerFormData.mobile);
        formData.append('password', registerFormData.password);
        formData.append('c_password', registerFormData.c_password);

        if (
            !registerFormData.first_name || !registerFormData.last_name ||
            !registerFormData.username || !registerFormData.email ||
            !registerFormData.mobile || !registerFormData.password ||
            !registerFormData.c_password
        ) {
            setErrorMsg('Please enter all fields');
            return;
        }

        if (registerFormData.password !== registerFormData.c_password) {
            setErrorMsg('Passwords do not match');
            return;
        }

        axios.post(baseUrl + 'customer/register/', formData)
            .then(function (response) {
                if (response.data.bool === false) {
                    setSuccessMsg('');
                    setErrorMsg(response.data.msg);
                } else {
                    setRegisterFormData({
                        'first_name': '',
                        'last_name': '',
                        'username': '',
                        'email': '',
                        'mobile': '',
                        'password': '',
                        'c_password': ''
                    });
                    setErrorMsg('');
                    setSuccessMsg(response.data.msg);

                    // Redirect to login page after 2 seconds
                    setTimeout(() => {
                        navigate('/customer/login');
                        // 👈 change route if needed
                    }, 2000);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const passwordRequirements = [
        'At least 8 characters long',
        'Cannot be entirely numeric',
        'Must not be a commonly used password',
        'Cannot be similar to username or email',
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-black px-4 py-10">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center  text-primary">Buyer Registration</h2>
                <p className="text-sm text-gray-500 text-center mb-4">Note: All fields are required.</p>

                {successMsg && <p className="text-green-600 text-center mb-4">{successMsg}</p>}
                {errorMsg && <p className="text-red-600 text-center mb-4">{errorMsg}</p>}

                <form>
                    {[
                        { label: 'First Name', name: 'first_name', type: 'text' },
                        { label: 'Last Name', name: 'last_name', type: 'text' },
                        { label: 'Username', name: 'username', type: 'text' },
                        { label: 'Email Address', name: 'email', type: 'email' },
                        { label: 'Phone Number', name: 'mobile', type: 'number' },
                    ].map((field, i) => (
                        <div className="mb-4" key={i}>
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 border-black">
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                name={field.name}
                                id={field.name}
                                onChange={inputHandler}
                                value={registerFormData[field.name]}
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                placeholder={`Enter your ${field.label}`}
                            />
                        </div>
                    ))}

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={inputHandler}
                            value={registerFormData.password}
                            onFocus={() => setTooltipVisible(true)}
                            onBlur={() => setTooltipVisible(false)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                            placeholder="Enter your password"
                        />
                        {tooltipVisible && (
                            <div className="mt-2 p-2 text-xs bg-orange-50 border border-orange-300 rounded-lg">
                                <p className="font-medium text-gray-800 mb-1">Password Requirements:</p>
                                <ul className="list-disc pl-4 text-gray-700">
                                    {passwordRequirements.map((req, index) => (
                                        <li key={index}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="c_password" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="c_password"
                            name="c_password"
                            onChange={inputHandler}
                            value={registerFormData.c_password}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={submitHandler}
                        className="w-full py-3 bg-gradient-to-r from-orange-400 to-black text-white font-semibold rounded-md hover:opacity-90 transition"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
