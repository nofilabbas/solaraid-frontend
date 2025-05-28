import React from "react";
import ResidentialImg from "../../assets/residential.jpeg"; 
import CommercialImg from "../../assets/commercial.jpeg";  
import IndustrialImg from "../../assets/industrial.jpeg";  
import AgriculturalImg from "../../assets/agricultural.jpeg"; 

const SolarSolutions = () => {
  const solutions = [
    {
      id: 1,
      img: ResidentialImg,
      title: "Residential Solar Solution",
      description:
        "We offer custom hybrid and on-grid solar solutions for homes, enabling you to reduce bills & earn by selling excess energy.",
    },
    {
      id: 2,
      img: CommercialImg,
      title: "Commercial Solar Solution",
      description:
        "Our tailored solar solutions for businesses reduce energy costs and boost sustainability with efficient on-grid and hybrid systems.",
    },
    {
      id: 3,
      img: IndustrialImg,
      title: "Industrial Solar Solution",
      description:
        "Our reliable, large-scale solutions for industrial customers ensure energy efficiency, cost savings, and uninterrupted power for high-demand operations.",
    },
    {
      id: 4,
      img: AgriculturalImg,
      title: "Agricultural Solar Solution",
      description:
        "Our solar water pumping systems are customized based on factors like water load and power requirements, ensuring utility savings and ROI within less than 2 years.",
    },
  ];

  return (
    <section className="py-10 bg-transparent-100">
      <div className="container mx-auto px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          We Offer Customized{" "}
          <span className="text-orange-600">Solar Energy Solutions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution) => (
            <div
              key={solution.id}
              className="border-2 border-black/80 rounded-lg shadow-lg p-4 text-center bg-transparent hover:shadow-2xl transition duration-300"
            >
              <div className="flex justify-center mb-8">
                <img
                  src={solution.img}
                  alt={solution.title}
                  className="w-32 h-32 transform rotate-45 rounded-lg"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-center">
                {solution.title}
              </h3>
              <p className="text-lg text-gray-600 text-center">
                {solution.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolarSolutions;
