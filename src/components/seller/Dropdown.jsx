import { useState } from 'react';

const Dropdown = ({ order, changeOrderStatus }) => {
    const [isOpen, setIsOpen] = useState(false); // Local state for each dropdown

    return (
        <div className="relative">
            <button
                className={`text-sm px-3 py-2 rounded-md shadow-md ${
                    order.order_status === 'pending'
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed hover:bg-gray-400 focus:bg-gray-400' // Disabled styles
                        : 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none' // Enabled styles
                }`}
                type="button"
                onClick={() => setIsOpen(!isOpen)} // Toggle local state
                aria-expanded={isOpen}
                disabled={order.order_status === 'pending'} // Disable the button
            >
                Change Status
            </button>
            {isOpen && (
                <ul className="absolute mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-40 z-10">
                    <li>
                        {order.order_status === 'processing' && (
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={(e) => {
                                    e.preventDefault();
                                    changeOrderStatus(order.id, "completed");
                                    setIsOpen(false); // Close the dropdown after changing status
                                }}
                            >
                                Complete
                            </a>
                        )}
                        {order.order_status === 'completed' && (
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={(e) => {
                                    e.preventDefault();
                                    changeOrderStatus(order.id, "processing");
                                    setIsOpen(false); // Close the dropdown after changing status
                                }}
                            >
                                Processing
                            </a>
                        )}
                    </li>
                </ul>
            )}
        </div>
    );
};

export default Dropdown;