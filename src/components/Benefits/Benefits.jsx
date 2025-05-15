import React from "react";
import { FaWind, FaTools, FaBatteryHalf, FaDollarSign } from "react-icons/fa";

const Benefits = () => {
  const benefits = [
    {
      id: 1,
      icon: <FaWind className="text-black-600 text-5xl group-hover:text-orange-500 transition duration-300" />,
      title: "Renewable Source",
      description: "Utilize clean energy and reduce your carbon footprint.",
    },
    {
      id: 2,
      icon: <FaTools className="text-black-600 text-5xl group-hover:text-orange-500 transition duration-300" />,
      title: "Easy Installation",
      description: "Our expert team ensures hassle-free and quick setups.",
    },
    {
      id: 3,
      icon: <FaBatteryHalf className="text-black-600 text-5xl group-hover:text-orange-500 transition duration-300" />,
      title: "Low Maintenance",
      description: "Reliable systems that require minimal upkeep.",
    },
    {
      id: 4,
      icon: <FaDollarSign className="text-black-600 text-5xl group-hover:text-orange-500 transition duration-300" />,
      title: "Affordable Power",
      description: "Save on energy costs with our cost-effective solutions.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 md:px-12 text-center">
      <h2
  data-aos="fade-up"
  data-aos-delay="200" // Delay before the animation starts
  data-aos-duration="1000" // Animation duration (in milliseconds)
  data-aos-offset="150" // Adjusts when the animation starts
  className="text-4xl font-bold mb-6"
>
  Why <span className="text-orange-600">Choose Us</span>
</h2>

        <p data-aos="fade-up"
  data-aos-delay="200" // Delay before the animation starts
  data-aos-duration="1000" // Animation duration (in milliseconds)
  data-aos-offset="150" // Adjusts when the animation starts
 
        className="text-gray-700 mb-10">
          Discover the unique benefits of our solar solutions. Switch to cleaner
          energy today and enjoy long-term savings.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="group bg-white border rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
            >
              <div className="flex justify-center">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <button className="text-center mt-10 cursor-pointer bg-primary text-white py-2 px-5 rounded-full hover:bg-white hover:text-orange-700 border-2 border-transparent hover:border-orange-600 transition duration-300">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
