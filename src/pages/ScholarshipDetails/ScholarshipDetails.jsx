import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router";
import useAxios from "../../hooks/useAxios";
import { AuthContext } from "../../contexts/AuthContext";

const ScholarshipDetails = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();
    const { user, logout } = useContext(AuthContext);

    const navigate = useNavigate();

    const [scholarship, setScholarship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [reviews, setReviews] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get(`/reviews/${id}`);
                setReviews(response.data);
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            } finally {
                setLoading2(false);
            }
        };

        fetchReviews();
    }, [axiosInstance]);

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

    const handleConfirmApply = async () => {
        try {
            const res = await axiosInstance.post("/applications", {
                scholarshipId: scholarship._id,
                scholarshipName: scholarship.scholarshipName,
                universityName: scholarship.universityName,
                userEmail: user.email,
                status: "pending",
                paymentStatus: "unpaid",
                appliedDate: new Date(),
            });

            document.getElementById("apply_confirm_modal").close();

            navigate("/dashboard/my-applications");
        } catch (err) {
            console.error("Failed to apply:", err);
        }
    };


    if (loading || loading2) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!scholarship) {
        return (
            <div className="text-center py-20 text-red-600 text-xl">
                Scholarship Not Found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* IMG */}
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
                    {/* University Info */}
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

                    {/* Info Grid */}
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

                    {/* Description & Coverage */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                        <h3 className="text-xl font-bold mb-2">Scholarship Description</h3>
                        <p>{scholarship.scholarshipDescription}</p>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                        <h3 className="text-xl font-bold mb-2">Stipend / Coverage</h3>
                        <p>{scholarship.stipendCoverage}</p>
                    </div>

                    <div className="mt-10 flex justify-end">
                        <button onClick={() => document.getElementById('apply_confirm_modal').showModal()}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                            Apply Now
                        </button>
                    </div>

                    {/* The modal for confirmation */}
                    <dialog id="apply_confirm_modal" className="modal">
                        <div className="modal-box rounded-xl p-6">

                            <h3 className="text-2xl font-bold text-center text-indigo-600">
                                Confirm Your Application
                            </h3>

                            <p className="text-gray-600 text-center mt-3">
                                Are you sure you want to apply for the <br />
                                <span className="font-semibold text-gray-800">
                                    {scholarship.scholarshipName}
                                </span> at
                                <span className="font-semibold text-gray-800"> {scholarship.universityName}</span>?
                            </p>

                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-4">
                                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                    <li>
                                        After confirming, you will be redirected to the
                                        <strong> My Application </strong>page.
                                    </li>
                                    <li>
                                        Your application will be created with status:
                                        <strong> Pending</strong>.
                                    </li>
                                    <li>
                                        You must complete the payment for your application to proceed.
                                    </li>
                                </ul>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                                    onClick={() => document.getElementById("apply_confirm_modal").close()}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                                    onClick={handleConfirmApply}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>

                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>

                </div>

                {/* Reviews section */}
                <div className="mt-10">
                    <h3 className="text-2xl font-bold mb-6">Student Reviews</h3>
                    {reviews?.length === 0 ? (
                        <p className="text-gray-500">No reviews yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div
                                    key={review._id}
                                    className="flex items-start gap-4 p-4 bg-white rounded-xl shadow border"
                                >
                                    <img
                                        src={review.userImage}
                                        alt={review.userName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold">{review.userName}</h4>
                                            <span className="text-gray-400 text-sm">
                                                {new Date(review.reviewDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-1">
                                            {Array.from({ length: review.ratingPoint }).map((_, i) => (
                                                <span key={i} className="text-yellow-400">★</span>
                                            ))}
                                            {Array.from({ length: 5 - review.ratingPoint }).map((_, i) => (
                                                <span key={i} className="text-gray-300">★</span>
                                            ))}
                                        </div>
                                        <p className="mt-2 text-gray-700">{review.reviewComment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
