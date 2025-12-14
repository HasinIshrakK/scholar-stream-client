import React, { useContext, useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { AuthContext } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";
import Loader from "../../../components/Loader";
const AllReviews = () => {

    const { user } = useContext(AuthContext);

    const axiosInstance = useAxios();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get(`/reviews`);
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
        return <p className="text-center py-10 text-gray-500">No review to show.</p>;
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
                text: "This review has been deleted.",
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

export default AllReviews;