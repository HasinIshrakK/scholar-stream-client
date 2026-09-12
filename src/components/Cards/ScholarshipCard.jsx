import React from "react";
import { Link } from "react-router";
import { FaMapMarkerAlt, FaRegClock } from "react-icons/fa";

const FALLBACK_IMAGE = "/assets/university-placeholder.jpeg";

const ScholarshipCard = ({ scholarship }) => {
    const {
        _id,
        scholarshipName,
        universityName,
        universityImage,
        universityCity,
        universityCountry,
        scholarshipCategory,
        applicationFees,
        applicationDeadline,
    } = scholarship;

    return (
        <div className="group bg-white rounded-xl border border-slate-200 hover:border-[#C9A227] hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
            <div className="relative">
                <img
                    src={universityImage || FALLBACK_IMAGE}
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    alt={universityName}
                    className="h-40 w-full object-cover"
                />
                {scholarshipCategory && (
                    <span className="absolute top-3 left-3 bg-white/95 text-[#0F1B3C] text-xs font-semibold px-2.5 py-1 rounded-full">
                        {scholarshipCategory}
                    </span>
                )}
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h2
                    className="text-lg font-semibold text-[#0F1B3C] mb-1 leading-snug line-clamp-2"
                    style={{ fontFamily: "'Fraunces', serif" }}
                >
                    {scholarshipName}
                </h2>
                <p className="text-sm text-slate-500 mb-4">{universityName}</p>

                <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#C9A227] text-xs shrink-0" />
                        <span>{universityCity}, {universityCountry}</span>
                    </div>
                    {applicationDeadline && (
                        <div className="flex items-center gap-2">
                            <FaRegClock className="text-[#C9A227] text-xs shrink-0" />
                            <span>Deadline {new Date(applicationDeadline).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mb-4 text-sm">
                    <span className="text-slate-400">Application fee</span>
                    <span className="font-semibold text-[#0F1B3C]">
                        {applicationFees > 0 ? `$${applicationFees}` : "Free"}
                    </span>
                </div>

                <Link
                    to={`/scholarships/${_id}`}
                    className="mt-auto block w-full text-center py-2.5 bg-[#0F1B3C] text-white rounded-lg font-medium text-sm group-hover:bg-[#C9A227] group-hover:text-[#0F1B3C] transition-colors"
                >
                    View details
                </Link>
            </div>
        </div>
    );
};

export default ScholarshipCard;
