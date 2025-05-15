import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component

const Button = () => {
  return (
    <div>
      <div className="flex justify-center">
        <Link to="/products"> {/* Link to the products page */}
          <button
            data-aos="zoom-in"
            data-aos-delay="100"
            className="text-center mt-10  cursor-pointer bg-primary text-white py-2 px-5 rounded-md"
          >
            VIEW ALL
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Button;
