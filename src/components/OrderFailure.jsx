import { Link } from 'react-router-dom';
import logo from '../logo.svg';

function OrderFailure() {
    return (
        <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-md text-center">
            <div>
                <i className="fa fa-times-circle text-red-600 text-6xl"></i>
            </div>
            <h3 className="text-3xl font-semibold text-red-600 mt-4">Oops!... Something went wrong</h3>
            <p className="mt-6 text-lg text-gray-700">
                Something went wrong with your order. Please try again later or contact support if the problem persists.
            </p>
            <div className="mt-6">
                <Link 
                    to="/" 
                    className="inline-block py-2 px-6 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Home
                </Link>
                <Link 
                    to="/customer/dashboard" 
                    className="inline-block py-2 px-6 ml-4 text-white bg-gray-600 hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Dashboard
                </Link>
            </div>
        </div>
    );
}

export default OrderFailure;
