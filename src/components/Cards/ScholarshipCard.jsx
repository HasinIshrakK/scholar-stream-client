import React from "react";
import { Link } from "react-router";

const ScholarshipCard = ({ scholarship }) => {

    return (
        <div className="border rounded-xl shadow-md p-4 bg-white">
            {/* University Image */}
            <img
                src={scholarship.universityImage}
                alt={scholarship.universityName}
                className="h-40 w-full object-cover rounded-lg mb-3"
            />

            {/* University Name */}
            <h2 className="text-lg font-bold mb-1">{scholarship.universityName}</h2>

            {/* Category + Location */}
            <p className="text-sm text-gray-600">
                <span className="font-semibold">Category:</span> {scholarship.category}
            </p>

            <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Location:</span> {scholarship.location}
            </p>

            {/* Application Fee */}
            <p className="text-sm mb-3">
                <span className="font-semibold">Application Fee:</span>{" "}
                {scholarship.fee > 0 ? `${scholarship.fee} BDT` : "Free"}
            </p>

            {/* View Details Button */}
            <Link to={`/scholarship/${scholarship._id}`}>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 hover:bg-blue-700">
                    View Details
                </button>
            </Link>
        </div>
    );
};

export default ScholarshipCard;
