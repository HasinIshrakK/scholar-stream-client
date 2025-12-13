import React, { useContext, useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { AuthContext } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";
import Loader from "../../../components/Loader";

const MyReviews = () => {

    const { user } = useContext(AuthContext);

    const axiosInstance = useAxios();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewRating, setReviewRating] = useState({});
    const [reviewComment, setReviewComment] = useState({});

    useEffect(() => {
        const fetchReviews = async () => {
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
    }, [axiosInstance, user, reviews]);

    if (loading) {
        return (
            <Loader />
        );
    }

    if (reviews.length === 0) {
        return <p className="text-center py-10 text-gray-500">You have not submitted any reviews yet.</p>;
    }

    const handleDelete = async (rev) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            theme: "auto",
        });

        if (!result.isConfirmed) return;

        try {
            await axiosInstance.delete(`/reviews/${rev._id}`);
            setReviews(prev =>
                prev.filter(rev => rev._id !== rev._id)
            );

            Swal.fire({
                title: "Deleted!",
                text: "Your review has been deleted.",
                icon: "success",
                theme: "auto",
            });

        } catch (error) {
            console.error("DELETE ERROR:", error.response?.data || error);
            Swal.fire({
                title: "Error!",
                text: "Failed to delete review. Please try again.",
                icon: "error",
                theme: "auto",
            });
        }
    };

    const handleRevSubmit = async (rev) => {
        const rating = reviewRating[rev._id];
        const comment = reviewComment[rev._id];

        if (!rating || !comment) {
            return alert("Please select a rating and write a comment.");
        }

        try {
            await axiosInstance.patch(`/reviews/${rev._id}`, {
                scholarshipName: rev.scholarshipName,
                universityName: rev.universityName,
                userName: user.name || user.displayName || "Anonymous",
                userEmail: user.email,
                userImage: user.photoURL || "https://randomuser.me/api/portraits/men/66.jpg",
                ratingPoint: parseInt(rating),
                reviewComment: comment,
            });

            alert("Review updated successfully!");
            document.getElementById(`review-${rev._id}`).close();

            setReviewRating((prev) => ({ ...prev, [rev._id]: "" }));
            setReviewComment((prev) => ({ ...prev, [rev._id]: "" }));

        } catch (err) {
            console.error("Review update error:", err);
            alert("Failed to update review. Please try again.");
        }
    };

    return (
        <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white shadow rounded-lg border">
                <thead>
                    <tr className="bg-gray-100 text-left border-b">
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
                        <tr key={rev._id} className="hover:bg-gray-50 border-b">
                            <td className="px-6 py-4">{rev.universityName}</td>
                            <td className="px-6 py-4">{rev.scholarshipName || "—"}</td>
                            <td className="px-6 py-4">{rev.ratingPoint} ⭐</td>
                            <td className="px-6 py-4">{rev.reviewComment}</td>
                            <td className="px-6 py-4">{new Date(rev.reviewDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 flex gap-2 my-auto">
                                <button className="btn btn-primary"
                                    onClick={() => document.getElementById(`review-${rev._id}`).showModal()}>
                                    Edit
                                </button>
                                <dialog id={`review-${rev._id}`} className="modal">
                                    <form method="dialog" className="modal-box">
                                        <h3 className="font-bold text-lg mb-4">Edit Review for {rev.scholarshipName}</h3>

                                        <div className="flex flex-col gap-3">
                                            <label className="font-semibold text-sm">Rating</label>
                                            <select className="select select-bordered w-full"
                                                value={reviewRating[rev._id] || ""} onChange={(e) =>
                                                    setReviewRating((prev) => ({ ...prev, [rev._id]: e.target.value }))
                                                }>
                                                <option value="">Select rating</option>
                                                <option value="5">⭐⭐⭐⭐⭐</option>
                                                <option value="4">⭐⭐⭐⭐</option>
                                                <option value="3">⭐⭐⭐</option>
                                                <option value="2">⭐⭐</option>
                                                <option value="1">⭐</option>
                                            </select>

                                            <label className="font-semibold text-sm">Comment</label>
                                            <textarea
                                                className="textarea textarea-bordered w-full" rows={4}
                                                placeholder="Write your review..." value={reviewComment[rev._id] || ""}
                                                onChange={(e) =>
                                                    setReviewComment((prev) => ({ ...prev, [rev._id]: e.target.value }))} />
                                        </div>

                                        <div className="modal-action">
                                            <button type="button"
                                                className="btn btn-primary" onClick={() => handleRevSubmit(rev)}>
                                                Submit
                                            </button>
                                            <button className="btn">Cancel</button>
                                        </div>
                                    </form>
                                </dialog>
                                <button onClick={() => handleDelete(rev)}
                                    className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyReviews;
