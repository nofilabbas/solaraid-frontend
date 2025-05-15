import React from "react";
import Image1 from "../../assets/IMAGE1.JPG";
import Image2 from "../../assets/IMAGE2.jpg";
import Image3 from "../../assets/IMAGE3.jpg";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Your Solar Energy Companion",
    description:
      "At Solaraid, we provide premium solar products in Pakistan, including panels, inverters, structures, cables, and batteries from trusted manufacturers. Our stringent quality assurance guarantees each installation meets high industry standards, ensuring long-term durability & customer satisfaction.",
  },
  {
    id: 2,
    img: Image2,
    title: "Your Solar Energy Companion",
    description:
      "As a Pakistan‘s Leading Solar Importer & Best Solar Energy Company, Solaraid prides itself on sourcing the highest quality solar panels, inverters, batteries, and related components from renowned manufacturers country wide.",
  },
  {
    id: 3,
    img: Image3,
    title: "Your Solar Energy Companion",
    description:
      "Solaraid stands out as one of the best solar companies in Pakistan, known for its rapid growth and dedication to providing top-tier solar solutions across Pakistan.",
  },
];

const Hero = () => {
  const navigate = useNavigate(); // Initialize navigate for programmatic navigation

  const handleOrderNowClick = () => {
    navigate("/products"); // Replace '/products' with your product page route
  };

  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-black/90 flex justify-center items center">
        {/* Background Patterns */}
        <div className="h-[700px] w-[700px] bg-orange-400 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z-9"></div>
        {/* Hero Section */}
        <div className="container pb-8 mt-10 sm:pb-0">
          {/* Slider */}
          <Slider {...settings}>
            {ImageList.map((data) => (
              <div key={data.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {/* Text Content Section */}
                  <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                    <h1
                      data-aos="zoom-out"
                      data-aos-duration="6000"
                      data-aos-oce="true"
                      className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white"
                    >
                      {data.title}
                    </h1>
                    <p
                      className="text-sm text-white"
                      data-aos="zoom-out"
                      data-aos-duration="6000"
                      data-aos-oce="true"
                    >
                      {data.description}
                    </p>
                    <div>
                      <button
                        data-aos="fade-in"
                        data-aos-duration="1000"
                        className="text-center mt-10 cursor-pointer bg-orange-400 text-white py-2 px-5 rounded-md hover:bg-white hover:text-orange-500 border-2 border-transparent hover:border-orange-500 transition duration-300"
                        onClick={handleOrderNowClick} // Handle navigation
                      >
                        ORDER NOW
                      </button>
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="order-1 sm:order-2 ">
                    <div className="relative ">
                    <img
  src={data.img}
  data-aos="zoom-out"
  data-aos-duration="6000"
  data-aos-oce="true"
  alt=""
  className="w-[200px] h-[200px] sm:h-[400px] sm:w-[400px] sm:scale-110 object-contain mx-auto hover:scale-105"
  style={{ filter: "brightness(1)" }}
/>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default Hero;
