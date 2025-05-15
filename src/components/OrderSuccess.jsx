import { Link } from 'react-router-dom';
import logo from '../logo.svg'

function OrderSuccess() {
    return (
        <div className="max-w-2xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-md text-center">
            <p className="text-green-500 text-5xl">
                <i className="fa fa-check-circle"></i>
            </p>
            <h3 className="text-3xl font-semibold text-green-600 mt-4">
                Thank you for your order!
            </h3>
            <div className="mt-6">
                <p className="text-lg text-gray-700">
                    Your order has been successfully placed. We will notify you once it's processed.
                </p>
            </div>
            <div className="mt-8">
                <Link to="/" className="inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Home
                </Link>
                <Link to="/customer/dashboard" className="inline-block ml-4 px-6 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700">
                    Dashboard
                </Link>
            </div>
        </div>
    );
}

export default OrderSuccess;
