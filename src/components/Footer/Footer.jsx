import React from "react";
import footerLogo from "../../assets/logo.png";
import Banner from "../../assets/footer-pattern.jpg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const FooterLinks = [
  {
    title: "Home",
    link: "/#",
  },
  {
    title: "About",
    link: "/#about",
  },
  {
    title: "Contact",
    link: "/#contact",
  },
  {
    title: "Blog",
    link: "/#blog",
  },
];

const Footer = () => {
  return (
    <div style={BannerImg} className="text-white flex justify-center">
    <div className="container">
      <div data-aos="zoom-in" className="grid md:grid-cols-3 pb-20 pt-4">
        {/* Company details */}
        <div className="py-4 px-8">
          <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3">
            <img src={footerLogo} alt="" className="max-w-[50px]" />
            Solaraid
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum in
            beatae ea recusandae blanditiis veritatis.
          </p>
        </div>
  
        {/* Footer Links and Map Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 col-span-2 md:pl-10 gap-10">
          <div>
            <div className="py-4 px-0">
              <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                Our Location
              </h1>
              <div className="w-full h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212779.51525951232!2d72.85333231391769!3d33.561691520510564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df948974419acb%3A0x984357e1632d30f!2sRawalpindi%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1733487400831!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
  
          {/* Social links and Contact Us Section */}
          <div className="py-4 px-8">
            <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
              Contact Us
            </h1>
            <div className="flex items-center gap-3 mt-6">
              <a href="#">
                <FaInstagram className="text-3xl" />
              </a>
              <a href="#">
                <FaFacebook className="text-3xl" />
              </a>
              <a href="#">
                <FaLinkedin className="text-3xl" />
              </a>
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <FaLocationArrow />
                <p>Rawalpindi, Pakistan</p>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <FaMobileAlt />
                <p>+92 123456789</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  
  );
};

export default Footer;