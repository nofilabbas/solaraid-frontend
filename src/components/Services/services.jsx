import React from "react";
import { FaSolarPanel, FaTools, FaLeaf, FaChartLine } from "react-icons/fa";

const services = [
  {
    icon: <FaSolarPanel className="text-primary text-4xl" />,
    title: "Solar Panel Installation",
    description:
      "We provide top-quality solar panel installation services for homes and businesses, ensuring optimal energy efficiency and long-term savings.",
  },
  {
    icon: <FaChartLine className="text-primary text-4xl" />,
    title: "Solar ROI & Cost Estimation",
    description:
      "Estimate your solar investment return using our advanced calculators and expert analysis for maximum value.",
  },
  {
    icon: <FaTools className="text-primary text-4xl" />,
    title: "Maintenance & Repairs",
    description:
      "Our support team ensures your solar system runs smoothly with routine maintenance and on-demand repair services.",
  },
  {
    icon: <FaLeaf className="text-primary text-4xl" />,
    title: "Sustainable Energy Consultation",
    description:
      "Get personalized consultations to choose the best solar solution tailored to your energy needs and environment.",
  },
];

const OurServices = () => {
  return (
    <div className="py-10 px-4 sm:px-10 lg:px-20 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Our Services</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Empowering you with clean energy solutions through innovation, quality, and trust.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center transition duration-300 hover:shadow-xl hover:scale-105"
          >
            <div className="mb-4 flex justify-center">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurServices;
