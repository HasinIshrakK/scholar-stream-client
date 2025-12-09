import React, { useContext, useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { AuthContext } from "../../../contexts/AuthContext";

const MyReviews = () => {

    const { user } = useContext(AuthContext);

    const axiosInstance = useAxios();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

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
    }, [axiosInstance, user]);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (reviews.length === 0) {
        return <p className="text-center py-10 text-gray-500">You have not submitted any reviews yet.</p>;
    }

    return (
        <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white shadow rounded-lg border">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="px-6 py-3 border-b">University</th>
                        <th className="px-6 py-3 border-b">Scholarship</th>
                        <th className="px-6 py-3 border-b">Rating</th>
                        <th className="px-6 py-3 border-b">Comment</th>
                        <th className="px-6 py-3 border-b">Date</th>
                        <th className="px-6 py-3 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((rev) => (
                        <tr key={rev._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 border-b">{rev.universityName}</td>
                            <td className="px-6 py-4 border-b">{rev.scholarshipName || "—"}</td>
                            <td className="px-6 py-4 border-b">{rev.ratingPoint} ⭐</td>
                            <td className="px-6 py-4 border-b">{rev.reviewComment}</td>
                            <td className="px-6 py-4 border-b">{new Date(rev.reviewDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 border-b flex gap-2">
                                <button className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white">
                                    Edit
                                </button>
                                <button className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white">
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
