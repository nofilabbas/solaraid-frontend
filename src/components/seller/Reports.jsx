import { Link } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';

function Reports() {
    return (
        <div className="container mx-auto">
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/4 mb-4">
                    <SellerSidebar />
                </div>
                <div className="w-full md:w-3/4 mt-4">
                    <div className="flex flex-wrap justify-between">
                        <div className="w-full sm:w-1/3 md:w-1/3 px-2 mb-4">
                            <div className="bg-white shadow-md rounded-lg p-6 text-center">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Daily Reports</h4>
                                <Link
                                    to="/seller/daily-report"
                                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                        <div className="w-full sm:w-1/3 md:w-1/3 px-2 mb-4">
                            <div className="bg-white shadow-md rounded-lg p-6 text-center">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Monthly Reports</h4>
                                <Link
                                    to="/seller/monthly-report"
                                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                        <div className="w-full sm:w-1/3 md:w-1/3 px-2 mb-4">
                            <div className="bg-white shadow-md rounded-lg p-6 text-center">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Yearly Reports</h4>
                                <Link
                                    to="/seller/yearly-report"
                                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reports;
