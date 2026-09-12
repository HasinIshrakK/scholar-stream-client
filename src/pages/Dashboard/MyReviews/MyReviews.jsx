import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import useAxios from "../../../hooks/useAxios";
import { AuthContext } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";
import Loader from "../../../components/Loader";
import { FaRegCommentDots } from "react-icons/fa";

const MyReviews = () => {
    const { user } = useContext(AuthContext);
    const axiosInstance = useAxios();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewRating, setReviewRating] = useState({});
    const [reviewComment, setReviewComment] = useState({});
    const [submittingId, setSubmittingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (!user?.email) return;

        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/reviews?email=${user.email}`);
                setReviews(response.data);
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
        // `reviews` must stay out of this dependency array — the effect sets
        // `reviews`, so including it here would re-trigger the fetch on every
        // fetch, forever.
    }, [axiosInstance, user?.email]);

    if (loading) {
        return <Loader />;
    }

    const handleDelete = async (rev) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0F1B3C",
            cancelButtonColor: "#94A3B8",
            confirmButtonText: "Yes, delete it!",
            theme: "auto",
        });

        if (!result.isConfirmed) return;

        setDeletingId(rev._id);
        try {
            await axiosInstance.delete(`/reviews/${rev._id}`);
            // Fixed: the original filter callback shadowed `rev`, comparing
            // each item's _id to itself (always false), which deleted every
            // review from the list instead of just this one.
            setReviews((prev) => prev.filter((r) => r._id !== rev._id));

            Swal.fire({ title: "Deleted!", text: "Your review has been deleted.", icon: "success", theme: "auto" });
        } catch (error) {
            console.error("DELETE ERROR:", error.response?.data || error);
            Swal.fire({ title: "Error!", text: "Failed to delete review. Please try again.", icon: "error", theme: "auto" });
        } finally {
            setDeletingId(null);
        }
    };

    const handleRevSubmit = async (rev) => {
        // Fall back to the review's existing values if the fields were never
        // touched — see the prefill fix in the modal inputs below.
        const rating = reviewRating[rev._id] ?? rev.ratingPoint;
        const comment = reviewComment[rev._id] ?? rev.reviewComment;

        if (!rating || !comment) {
            Swal.fire({ title: "Almost there", text: "Please select a rating and write a comment.", icon: "info" });
            return;
        }

        setSubmittingId(rev._id);
        try {
            await axiosInstance.patch(`/reviews/${rev._id}`, {
                scholarshipName: rev.scholarshipName,
                universityName: rev.universityName,
                userName: user.displayName || "Anonymous",
                userEmail: user.email,
                userImage: user.photoURL || "/user.png",
                ratingPoint: parseInt(rating),
                reviewComment: comment,
            });

            document.getElementById(`review-${rev._id}`).close();
            setReviews((prev) =>
                prev.map((r) => (r._id === rev._id ? { ...r, ratingPoint: parseInt(rating), reviewComment: comment } : r))
            );

            Swal.fire({ title: "Updated!", text: "Your review has been updated.", icon: "success" });
        } catch (err) {
            console.error("Review update error:", err);
            Swal.fire({ title: "Error", text: "Failed to update review. Please try again.", icon: "error" });
        } finally {
            setSubmittingId(null);
        }
    };

    if (reviews.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="text-center max-w-sm">
                    <div className="w-12 h-12 rounded-full bg-[#0F1B3C]/5 text-[#0F1B3C] flex items-center justify-center mx-auto mb-4 text-lg">
                        <FaRegCommentDots />
                    </div>
                    <h3 className="font-semibold text-lg text-[#0F1B3C] mb-1">No reviews yet</h3>
                    <p className="text-slate-500 text-sm mb-6">Once a scholarship application is completed, you can leave a review from My Applications.</p>
                    <Link
                        to="/dashboard/my-applications"
                        className="inline-block px-5 py-2.5 bg-[#0F1B3C] text-white rounded-lg font-medium text-sm hover:bg-[#16234F] transition-colors"
                    >
                        Go to my applications
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#FAF9F5] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
            <h1
                className="text-2xl font-semibold text-[#0F1B3C] mb-6"
                style={{ fontFamily: "'Fraunces', serif" }}
            >
                My Reviews
            </h1>

            <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                <table className="min-w-full">
                    <thead>
                        <tr className="text-left border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wide">
                            <th className="px-6 py-3">University</th>
                            <th className="px-6 py-3">Scholarship</th>
                            <th className="px-6 py-3">Rating</th>
                            <th className="px-6 py-3">Comment</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((rev) => (
                            <tr key={rev._id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                                <td className="px-6 py-4 text-[#0F1B3C] font-medium">{rev.universityName}</td>
                                <td className="px-6 py-4 text-slate-600">{rev.scholarshipName || "—"}</td>
                                <td className="px-6 py-4 text-[#C9A227]">{rev.ratingPoint} ⭐</td>
                                <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={rev.reviewComment}>
                                    {rev.reviewComment}
                                </td>
                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                    {new Date(rev.reviewDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-sm border border-slate-200 bg-white text-[#0F1B3C] hover:border-[#C9A227] hover:bg-white"
                                            onClick={() => document.getElementById(`review-${rev._id}`).showModal()}
                                        >
                                            Edit
                                        </button>
                                        <dialog id={`review-${rev._id}`} className="modal">
                                            <form method="dialog" className="modal-box">
                                                <h3 className="font-bold text-lg mb-4 text-[#0F1B3C]" style={{ fontFamily: "'Fraunces', serif" }}>
                                                    Edit review for {rev.scholarshipName}
                                                </h3>

                                                <div className="flex flex-col gap-3">
                                                    <label className="font-semibold text-sm text-slate-600">Rating</label>
                                                    <select
                                                        className="select select-bordered w-full"
                                                        value={reviewRating[rev._id] ?? rev.ratingPoint ?? ""}
                                                        onChange={(e) => setReviewRating((prev) => ({ ...prev, [rev._id]: e.target.value }))}
                                                    >
                                                        <option value="">Select rating</option>
                                                        <option value="5">⭐⭐⭐⭐⭐</option>
                                                        <option value="4">⭐⭐⭐⭐</option>
                                                        <option value="3">⭐⭐⭐</option>
                                                        <option value="2">⭐⭐</option>
                                                        <option value="1">⭐</option>
                                                    </select>

                                                    <label className="font-semibold text-sm text-slate-600">Comment</label>
                                                    <textarea
                                                        className="textarea textarea-bordered w-full"
                                                        rows={4}
                                                        placeholder="Write your review..."
                                                        value={reviewComment[rev._id] ?? rev.reviewComment ?? ""}
                                                        onChange={(e) => setReviewComment((prev) => ({ ...prev, [rev._id]: e.target.value }))}
                                                    />
                                                </div>

                                                <div className="modal-action">
                                                    <button
                                                        type="button"
                                                        disabled={submittingId === rev._id}
                                                        className="btn bg-[#0F1B3C] text-white hover:bg-[#16234F] border-none disabled:opacity-70"
                                                        onClick={() => handleRevSubmit(rev)}
                                                    >
                                                        {submittingId === rev._id ? "Saving..." : "Submit"}
                                                    </button>
                                                    <button className="btn">Cancel</button>
                                                </div>
                                            </form>
                                        </dialog>

                                        <button
                                            onClick={() => handleDelete(rev)}
                                            disabled={deletingId === rev._id}
                                            className="btn btn-sm bg-red-600 text-white hover:bg-red-700 border-none disabled:opacity-70"
                                        >
                                            {deletingId === rev._id ? "Deleting..." : "Delete"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyReviews;