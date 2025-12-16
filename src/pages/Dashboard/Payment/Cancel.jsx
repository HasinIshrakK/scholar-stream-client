import React from "react";
import { Link } from "react-router";
import { FaTimesCircle } from "react-icons/fa";

const Cancel = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-red-50">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md">
                <FaTimesCircle className="text-red-600 text-6xl mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Payment Cancelled</h2>
                <p className="text-gray-600 mb-6">
                    Your payment was not completed. You can try again if you want.
                </p>
                <Link to="/dashboard/my-applications">
                    <button className="btn btn-error w-full">Back to Applications</button>
                </Link>
            </div>
        </div>
    );
};

export default Cancel;