import React from "react";
import aboutus from "../../assets/aboutus.jpeg";
const AboutUs = () => {
  return (
    <div className="py-12 px-4 sm:px-10 lg:px-20 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">About Us</h1>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Solaraid is committed to transforming energy consumption through sustainable solar solutions. We empower individuals and businesses to harness the power of the sun for a cleaner future.
        </p>
      </div>

      {/* Company Story */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl font-semibold text-primary mb-4">Who We Are</h2>
          <p className="text-gray-700 dark:text-gray-400 mb-4">
            Founded with a vision of making solar energy accessible to everyone, Solaraid blends innovation with trust. We offer tools, products, and guidance that help you adopt solar technology easily and affordably.
          </p>
          <p className="text-gray-700 dark:text-gray-400">
            Whether you're a homeowner, a business, or an installer, we aim to support your solar journey through expert consultation, ROI estimation, product sourcing, and installation support.
          </p>
        </div>

        <div>
        <img
  
  src={aboutus}
  alt="Solar Team"
  style={{ width: '300px', height: 'auto' }}
  className="mx-auto rounded-xl shadow-md"
/>


        </div>
      </div>

      {/* Core Values */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold text-primary mb-6">Our Core Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Sustainability", text: "We believe in a future driven by clean energy." },
            { title: "Innovation", text: "We embrace smart solutions to simplify solar adoption." },
            { title: "Integrity", text: "We prioritize honesty, quality, and customer trust." },
            { title: "Support", text: "We’re here to assist you every step of the way." },
          ].map((value, idx) => (
            <div
              key={idx}
              className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-md"
            >
              <h3 className="text-lg font-semibold mb-2 text-primary">{value.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{value.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
