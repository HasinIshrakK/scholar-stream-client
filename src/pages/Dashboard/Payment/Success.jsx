import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router";

const Success = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-green-50">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md">
                <FaCheckCircle className="text-green-600 text-6xl mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-6">
                    Your payment has been successfully processed. Thank you!
                </p>
                <Link to="/dashboard/my-applications">
                    <button className="btn btn-primary w-full">Go to My Applications</button>
                </Link>
            </div>
        </div>
    );
};

export default Success;