import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Link } from "react-router";
import useAxios from "../../hooks/useAxios";
import { AuthContext } from "../../contexts/AuthContext";
import Loader from "../../components/Loader";
import {
    FaMapMarkerAlt, FaGraduationCap, FaMoneyBillWave, FaRegClock,
    FaBookOpen, FaEnvelope, FaStar, FaRegStar
} from "react-icons/fa";

const InfoTile = ({ label, value, danger }) => (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-slate-500 text-xs mb-1">{label}</p>
        <p className={`font-semibold ${danger ? "text-red-600" : "text-[#0F1B3C]"}`}>{value}</p>
    </div>
);

const ScholarshipDetails = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();

    const [scholarship, setScholarship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [reviews, setReviews] = useState(null);
    const [reviewsError, setReviewsError] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading2(true);
            setReviewsError(false);
            try {
                const response = await axiosInstance.get(`/reviews/${id}`);
                setReviews(response.data);
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
                setReviewsError(true);
            } finally {
                setLoading2(false);
            }
        };

        fetchReviews();
    }, [axiosInstance, id]);

    useEffect(() => {
        const loadScholarship = async () => {
            setLoading(true);
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
    }, [axiosInstance, id]);

    const handleApplyClick = () => {
        if (!user) {
            navigate("/auth/login", { state: { from: location.pathname } });
            return;
        }
        document.getElementById("apply_confirm_modal").showModal();
    };

    const handleConfirmApply = async () => {
        try {
            await axiosInstance.post("/applications", {
                scholarshipId: scholarship._id,
                scholarshipName: scholarship.scholarshipName,
                universityName: scholarship.universityName,
                userName: user.displayName,
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
        return <Loader />;
    }

    if (!scholarship) {
        return (
            <div className="text-center py-24 text-[#0F1B3C]">
                <p className="text-xl font-semibold">Scholarship not found</p>
                <Link to="/all-scholarships" className="text-sm text-slate-500 hover:text-[#0F1B3C] underline mt-2 inline-block">
                    ← Back to scholarships
                </Link>
            </div>
        );
    }

    const deadlinePassed = new Date(scholarship.applicationDeadline) < new Date();

    const FALLBACK_IMAGE = "/assets/university-placeholder.jpeg";

    return (
        <div className="min-h-screen bg-[#FAF9F5] pb-20" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* IMG */}
            <div className="w-full h-64 relative">
                <img
                    src={scholarship.universityImage || FALLBACK_IMAGE}
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1B3C]/90 via-[#0F1B3C]/40 to-transparent flex items-end justify-center pb-8 px-4">
                    <h1
                        className="text-3xl sm:text-4xl xl:text-5xl font-semibold text-white text-center"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        {scholarship.scholarshipName}
                    </h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 mt-10">
                <div className="bg-white shadow-sm rounded-xl p-6 border border-slate-200">
                    {/* University Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-[#0F1B3C]" style={{ fontFamily: "'Fraunces', serif" }}>
                                {scholarship.universityName}
                            </h2>
                            <p className="text-slate-500 flex items-center gap-2 mt-1">
                                <FaMapMarkerAlt className="text-[#C9A227] text-xs" />
                                {scholarship.universityCity}, {scholarship.universityCountry}
                            </p>
                        </div>

                        {scholarship.universityWorldRank && (
                            <div className="bg-[#0F1B3C] text-white px-4 py-2 rounded-lg font-semibold text-sm shrink-0">
                                World rank #{scholarship.universityWorldRank}
                            </div>
                        )}
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 text-sm">
                        <InfoTile label="Subject category" value={scholarship.subjectCategory} />
                        <InfoTile label="Scholarship category" value={scholarship.scholarshipCategory} />
                        <InfoTile label="Degree level" value={scholarship.degree} />
                        <InfoTile
                            label="Tuition fees"
                            value={scholarship.tuitionFees ? `$${scholarship.tuitionFees}` : "Free"}
                        />
                        <InfoTile
                            label="Application fee"
                            value={scholarship.applicationFees ? `$${scholarship.applicationFees}` : "Free"}
                        />
                        <InfoTile
                            label="Service charge"
                            value={scholarship.serviceCharge ? `$${scholarship.serviceCharge}` : "None"}
                        />
                        <InfoTile
                            label="Application deadline"
                            value={new Date(scholarship.applicationDeadline).toLocaleDateString()}
                            danger
                        />
                        <InfoTile
                            label="Posted on"
                            value={new Date(scholarship.scholarshipPostDate).toLocaleDateString()}
                        />
                        <InfoTile label="Posted by" value={scholarship.postedUserEmail} />
                    </div>

                    {deadlinePassed && (
                        <div className="mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
                            This application deadline has passed. Applications may no longer be accepted.
                        </div>
                    )}

                    {/* Description & Coverage */}
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#0F1B3C] mb-2">
                            <FaBookOpen className="text-[#C9A227] text-sm" /> Scholarship description
                        </h3>
                        <p className="text-slate-600 leading-relaxed">{scholarship.scholarshipDescription}</p>
                    </div>

                    <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#0F1B3C] mb-2">
                            <FaMoneyBillWave className="text-[#C9A227] text-sm" /> Stipend / coverage
                        </h3>
                        <p className="text-slate-600 leading-relaxed">{scholarship.stipendCoverage}</p>
                    </div>

                    {!deadlinePassed && (
                        <div className="mt-10 flex justify-end">
                            <button
                                onClick={handleApplyClick}
                                className="px-6 py-3 bg-[#0F1B3C] text-white rounded-lg font-semibold hover:bg-[#16234F] transition-colors"
                            >
                                {user ? "Apply now" : "Log in to apply"}
                            </button>
                        </div>
                    )}

                    {/* The modal for confirmation */}
                    <dialog id="apply_confirm_modal" className="modal">
                        <div className="modal-box rounded-xl p-6" style={{ fontFamily: "'Inter', sans-serif" }}>

                            <h3
                                className="text-2xl font-semibold text-center text-[#0F1B3C]"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                Confirm your application
                            </h3>

                            <p className="text-slate-600 text-center mt-3">
                                Are you sure you want to apply for the <br />
                                <span className="font-semibold text-[#0F1B3C]">
                                    {scholarship.scholarshipName}
                                </span> at
                                <span className="font-semibold text-[#0F1B3C]"> {scholarship.universityName}</span>?
                            </p>

                            <div className="bg-[#0F1B3C]/5 border border-[#0F1B3C]/10 rounded-lg p-4 mt-4">
                                <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
                                    <li>
                                        After confirming, you'll be redirected to the
                                        <strong> My Applications</strong> page.
                                    </li>
                                    <li>
                                        Your application will be created with status
                                        <strong> pending</strong>.
                                    </li>
                                    <li>
                                        You must complete payment for your application to proceed.
                                    </li>
                                </ul>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                                    onClick={() => document.getElementById("apply_confirm_modal").close()}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="px-5 py-2 rounded-lg bg-[#0F1B3C] text-white hover:bg-[#16234F] transition-colors"
                                    onClick={handleConfirmApply}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>

                        <form method="dialog" className="modal-backdrop">
                            <button aria-label="Close">close</button>
                        </form>
                    </dialog>

                </div>

                {/* Reviews section */}
                <div className="mt-10">
                    <h3 className="text-2xl font-semibold mb-6 text-[#0F1B3C]" style={{ fontFamily: "'Fraunces', serif" }}>
                        Student reviews
                    </h3>
                    {reviewsError ? (
                        <p className="text-slate-500">Reviews couldn't be loaded right now.</p>
                    ) : !reviews || reviews.length === 0 ? (
                        <p className="text-slate-500">No reviews yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div
                                    key={review._id}
                                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200"
                                >
                                    <img
                                        src={review.userImage || "/user.png"}
                                        alt={review.userName}
                                        className="w-12 h-12 rounded-full object-cover shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <div className="flex items-center justify-between gap-3">
                                            <h4 className="font-semibold text-[#0F1B3C] truncate">{review.userName}</h4>
                                            <span className="text-slate-400 text-sm shrink-0">
                                                {new Date(review.reviewDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-1">
                                            {Array.from({ length: review.ratingPoint }).map((_, i) => (
                                                <FaStar key={i} className="text-[#C9A227] text-sm" />
                                            ))}
                                            {Array.from({ length: 5 - review.ratingPoint }).map((_, i) => (
                                                <FaRegStar key={i} className="text-slate-300 text-sm" />
                                            ))}
                                        </div>
                                        <p className="mt-2 text-slate-600 text-sm leading-relaxed">{review.reviewComment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <Link to="/all-scholarships" className="text-sm text-slate-500 hover:text-[#0F1B3C] transition-colors">
                        ← Back to scholarships
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ScholarshipDetails;
