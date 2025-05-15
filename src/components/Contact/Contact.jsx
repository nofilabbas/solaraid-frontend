import React, { useState } from "react";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaInfoCircle,
  FaPen,
  FaPaperPlane,
} from "react-icons/fa";
import ContactImage from "../../assets/contactus.png";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "solaraidpk",
        "template_soj4ecw",
        e.target,
        "mghbfUv_kI1ffrh0a"
      )
      .then(
        (result) => {
          toast.success("Thank you! Your message has been sent ✅", {
            position: "top-center",
            autoClose: 3000,
          });
          setFormData({
            name: "",
            phone: "",
            email: "",
            subject: "",
            message: "",
          });
        },
        (error) => {
          toast.error("Failed to send message. Please try again ❌", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      );
  };

  return (
    <div className="w-full">
      <ToastContainer />

      {/* Hero Section */}
      <div
        className="relative w-full h-[400px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${ContactImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <h1 className="relative text-5xl font-bold border-b-4 border-white pb-2">
          Contact Us
        </h1>
      </div>

      {/* Contact Section */}
      <div className="bg-white text-black py-16 px-8 md:px-16 flex flex-col md:flex-row gap-10">
        {/* Left: Contact Info */}
        <div className="md:w-1/2">
          <h3 className="text-sm font-semibold tracking-wide text-gray-600 uppercase">
            Contact Our Experts
          </h3>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">
            Get Your Instant <br /> Free Quote Now
          </h1>
          <p className="text-gray-600 mt-4">
            Need assistance? Our team is here to help you with all your solar energy
            needs. Get in touch with us for inquiries, quotes, or expert advice.
          </p>
          <div className="flex items-center text-lg font-semibold text-gray-900 mt-4">
            <div className="bg-orange-600 p-3 rounded-full text-white">
              <FaPhoneAlt className="text-xl" />
            </div>
            <span className="ml-3">+92 331 564321</span>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center border-b border-gray-300 py-2">
              <FaUser className="text-orange-600 mr-3" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full outline-none bg-transparent text-gray-700"
                required
              />
            </div>

            <div className="flex items-center border-b border-gray-300 py-2">
              <FaPhoneAlt className="text-orange-600 mr-3" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="w-full outline-none bg-transparent text-gray-700"
                required
              />
            </div>

            <div className="flex items-center border-b border-gray-300 py-2">
              <FaEnvelope className="text-orange-600 mr-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full outline-none bg-transparent text-gray-700"
                required
              />
            </div>

            <div className="flex items-center border-b border-gray-300 py-2">
              <FaInfoCircle className="text-orange-600 mr-3" />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Subject"
                className="w-full outline-none bg-transparent text-gray-700"
                required
              />
            </div>

            <div className="flex items-center border-b border-gray-300 py-2">
              <FaPen className="text-orange-600 mr-3" />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="How can we help you? Feel free to get in touch!"
                className="w-full outline-none bg-transparent text-gray-700 resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 hover:bg-orange-600 transition"
            >
              <FaPaperPlane /> Get In Touch
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
