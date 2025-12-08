import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router";
import useAxios from "../../hooks/useAxios";

const ScholarshipDetails = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();

    const [scholarship, setScholarship] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadScholarship = async () => {
            try {
                const res = await axiosInstance.get(`/scholarships/${id}`);
                setScholarship(res.data);
            } catch (err) {
                console.error("Failed to load scholarship:", err);
            } finally {
                setLoading(false);
            }
        };

        loadScholarship();
    }, [id]);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!scholarship) {
        return <div className="text-center py-20 text-red-600 text-xl">Scholarship Not Found</div>;
    }


    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            {/* HEADER IMAGE */}
            <div className="w-full h-64 relative">
                <img
                    src={scholarship.universityImage}
                    alt={scholarship.universityName}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h1 className="text-3xl sm:text-4xl text-center xl:text-5xl font-bold text-white drop-shadow-lg">
                        {scholarship.scholarshipName}
                    </h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 mt-10">

                <div className="bg-white shadow-xl rounded-xl p-6 border">

                    {/* UNIVERSITY INFO */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">{scholarship.universityName}</h2>
                            <p className="text-gray-600">
                                {scholarship.universityCity}, {scholarship.universityCountry}
                            </p>
                        </div>

                        {scholarship.universityWorldRank && (
                            <div className="mt-4 sm:mt-0 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold">
                                World Rank: #{scholarship.universityWorldRank}
                            </div>
                        )}
                    </div>

                    {/* INFO GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 text-sm">

                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <p className="text-gray-500">Subject Category</p>
                            <p className="font-semibold">{scholarship.subjectCategory}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <p className="text-gray-500">Scholarship Category</p>
                            <p className="font-semibold">{scholarship.scholarshipCategory}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <p className="text-gray-500">Degree Level</p>
                            <p className="font-semibold">{scholarship.degree}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <p className="text-gray-500">Tuition Fees</p>
                            <p className="font-semibold">
                                {scholarship.tuitionFees ? `৳${scholarship.tuitionFees}` : "Free"}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <p className="text-gray-500">Application Fee</p>
                            <p className="font-semibold">
                                {scholarship.applicationFees ? `৳${scholarship.applicationFees}` : "Free"}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <p className="text-gray-500">Service Charge</p>
                            <p className="font-semibold">
                                {scholarship.serviceCharge ? `৳${scholarship.serviceCharge}` : "None"}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <p className="text-gray-500">Application Deadline</p>
                            <p className="font-semibold text-red-600">
                                {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <p className="text-gray-500">Posted On</p>
                            <p className="font-semibold">
                                {new Date(scholarship.scholarshipPostDate).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <p className="text-gray-500">Posted By</p>
                            <p className="font-semibold">{scholarship.postedUserEmail}</p>
                        </div>

                    </div>

                    <div className="mt-10 flex justify-end">
                        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                            Apply Now
                        </button>
                    </div>

                </div>


                <div className="mt-6">
                    <Link to="/all-scholarships" className="text-indigo-600 hover:underline">
                        ← Back to Scholarships
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ScholarshipDetails;
