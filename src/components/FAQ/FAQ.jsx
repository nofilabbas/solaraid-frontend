import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // if you're using react-router
import { Link } from "react-router-dom";

const faqData = [
  {
    question: "What is Solaraid?",
    answer:
      "Solaraid is a platform that helps individuals and businesses adopt solar energy by offering tools like ROI calculators, solar product marketplace, and expert consultation.",
  },
  {
    question: "How can I estimate the cost of a solar system?",
    answer: (
      <>
        You can use our built-in{" "}
        <Link
          to="/solar-calculator"
          className="text-primary font-semibold  hover:text-primary/80"
        >
          Solar Calculator
        </Link>{" "}
        to estimate the installation cost, savings, and payback period for your specific location and usage.
      </>
    ),
  },
  {
    question: "Do you offer installation services?",
    answer:
      "Yes, we connect you with verified installation partners based on your location and system size requirements.",
  },
  {
    question: "Can I sell my solar products on Solaraid?",
    answer: (
      <>
        Yes, if you're a seller, you can register as a vendor and list your solar products through our{" "}
        <Link to="/seller/register" className="text-primary font-semibold hover:text-primary/80">
  seller dashboard
</Link>

      </>
    ),
  },
  {
    question: "Is consultation available for beginners?",
    answer:
      "Absolutely! We provide beginner-friendly consultations to help you understand solar solutions, investment, and system sizing.",
  },
  {
    question: "What kind of solar products do you offer?",
    answer:
      "We list a wide range of solar products including panels, inverters, batteries, charge controllers, and accessories.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate(); // optional, if you want to navigate to a contact page

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-10 lg:px-20 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-4xl font-bold text-center text-primary mb-10">
        Frequently Asked Questions
      </h1>

      <div className="max-w-3xl mx-auto space-y-6">
        {faqData.map((item, index) => (
          <div key={index} className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-6 py-4 font-medium text-lg flex justify-between items-center focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {item.question}
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 text-gray-600 dark:text-gray-400">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Us CTA */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Still have a question?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          If you can’t find the answer you’re looking for, feel free to contact our team.
        </p>
        <button
          onClick={() => navigate("/contact")} // make sure /contact route exists
          className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg transition"
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default FAQ;
