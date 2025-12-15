import React, { useContext, useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { Link } from "react-router";
import { AuthContext } from "../../../contexts/AuthContext";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import Loader from "../../../components/Loader";

const MyApplications = () => {
    const axiosInstance = useAxios();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scholarship, setScholarship] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState({});
    const [reviewComment, setReviewComment] = useState({});
    const [selectedApp, setSelectedApp] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user?.email) return;
        const fetchApplications = async () => {
            try {
                const response = await axiosInstance.get(`/applications?email=${user?.email}`);
                setApplications(response.data);
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [user?.email, axiosInstance]);

    if (loading) {
        return (
            <Loader />
        );
    }

    if (applications.length === 0) {
        return <p className="text-center py-10 text-gray-500">You have not submitted any applications yet.</p>;
    }

    const handlePay = async (app) => {
        try {
            const res = await axiosInstance.post('/create-checkout-session', {
                applicationFees: 50,
                scholarshipName: app.scholarshipName,
                userEmail: user.email || user.userEmail,
                applicationId: app._id
            });

            window.location.href = res.data.url;

        } catch (error) {
            console.error("PAY ERROR:", error.response?.data || error);
        }
    };

    const handleDelete = async (app) => {
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
            await axiosInstance.delete(`/applications/${app._id}`);
            setApplications(prev =>
                prev.filter(app => app._id !== app._id)
            );

            Swal.fire({
                title: "Deleted!",
                text: "Your application has been deleted.",
                icon: "success",
                theme: "auto",
            });

        } catch (error) {
            console.error("DELETE ERROR:", error.response?.data || error);
            Swal.fire({
                title: "Error!",
                text: "Failed to delete application. Please try again.",
                icon: "error",
                theme: "auto",
            });
        }
    };

    const handleRevSubmit = async (app) => {
        const rating = reviewRating[app._id];
        const comment = reviewComment[app._id];

        if (!rating || !comment) {
            return alert("Please select a rating and write a comment.");
        }

        try {
            await axiosInstance.post("/reviews", {
                scholarshipId: app._id,
                scholarshipName: app.scholarshipName,
                universityName: app.universityName,
                userName: user.name || user.displayName || "Anonymous",
                userEmail: user.email,
                userImage: user.photoURL || "https://randomuser.me/api/portraits/men/66.jpg",
                ratingPoint: parseInt(rating),
                reviewComment: comment,
                reviewDate: new Date().toISOString(),
            });

            alert("Review submitted successfully!");
            document.getElementById(`review-${app._id}`).close();

            setReviewRating((prev) => ({ ...prev, [app._id]: "" }));
            setReviewComment((prev) => ({ ...prev, [app._id]: "" }));

        } catch (err) {
            console.error("Review submission error:", err);
            alert("Failed to submit review. Please try again.");
        }
    };

    return (
        <div className="overflow-x-auto mt-6">
            <table className="table table-zebra px-4">

                <thead>
                    <tr>
                        <th></th>
                        <th>Scholarship</th>
                        <th>University</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {applications.map((app, index) => (
                        <tr key={app._id}>
                            <th>{index + 1}</th>

                            {/* Scholarship Info */}
                            <td>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <div className="font-bold">{app.scholarshipName}</div>
                                        <div className="text-sm opacity-50">{app.degree}</div>
                                    </div>
                                </div>
                            </td>

                            {/* University */}
                            <td>
                                {app.universityName}
                            </td>

                            {/* Status */}
                            <td>
                                <span
                                    className={`badge capitalize ${app.status === "completed"
                                        ? "badge-success"
                                        : app.status === "rejected"
                                            ? "badge-error"
                                            : "badge-warning"
                                        } badge-sm text-white`}

                                >
                                    {app.status}
                                </span>
                            </td>

                            {/* Action Buttons */}
                            <td className="space-x-2 flex items-center">
                                {app.status === "pending" && (
                                    <Link to={`/dashboard/edit/${app.scholarshipId}`}>
                                        <button className="text-primary text-2xl link">
                                            <FaEdit />
                                        </button>
                                    </Link>
                                )}
                                <button className="btn btn-primary btn-outline btn-sm"
                                    onClick={async () => {
                                        setSelectedApp(app);
                                        const res = await axiosInstance.get(`/scholarships/${app.scholarshipId}`);
                                        setScholarship(res.data);
                                        document.getElementById("details_modal").showModal();
                                    }}>
                                    Details
                                </button>

                                {app.paymentStatus === "unpaid" && app.status === "pending" && (
                                    <button className="btn btn-sm bg-indigo-600 text-white hover:bg-indigo-700"
                                        onClick={() => handlePay(app)}                                    >
                                        Pay
                                    </button>
                                )}
                                {app.status === "completed" && (
                                    <>
                                        <button
                                            className="btn btn-sm bg-indigo-600 text-white hover:bg-indigo-700"
                                            onClick={() => document.getElementById(`review-${app._id}`).showModal()}>
                                            Add a review
                                        </button>
                                        <dialog id={`review-${app._id}`} className="modal">
                                            <form method="dialog" className="modal-box">
                                                <h3 className="font-bold text-lg mb-4">Add a Review for {app.scholarshipName}</h3>

                                                <div className="flex flex-col gap-3">
                                                    <label className="font-semibold text-sm">Rating</label>
                                                    <select className="select select-bordered w-full"
                                                        value={reviewRating[app._id] || ""} onChange={(e) =>
                                                            setReviewRating((prev) => ({ ...prev, [app._id]: e.target.value }))
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
                                                        placeholder="Write your review..." value={reviewComment[app._id] || ""}
                                                        onChange={(e) =>
                                                            setReviewComment((prev) => ({ ...prev, [app._id]: e.target.value }))} />
                                                </div>

                                                <div className="modal-action">
                                                    <button type="button"
                                                        className="btn btn-primary" onClick={() => handleRevSubmit(app)}>
                                                        Submit
                                                    </button>
                                                    <button className="btn">Cancel</button>
                                                </div>
                                            </form>
                                        </dialog>
                                    </>
                                )}
                                {app.status === "pending" && (
                                    <button className="btn btn-sm bg-red-500 text-white"
                                        onClick={() => handleDelete(app)}                                    >
                                        Delete
                                    </button>
                                )}

                                <dialog id="details_modal" className="modal">
                                    <div className="modal-box max-w-3xl">
                                        {!scholarship ? (
                                            <Loader />
                                        ) : (
                                            <>
                                                <h3 className="font-bold text-xl mb-4">
                                                    Application Details
                                                </h3>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

                                                    <div>
                                                        <p className="text-gray-500">Scholarship</p>
                                                        <p className="font-semibold">{scholarship.scholarshipName}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">University</p>
                                                        <p className="font-semibold">{scholarship.universityName}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">Degree</p>
                                                        <p className="font-semibold">{scholarship.degree}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">Category</p>
                                                        <p className="font-semibold">{scholarship.scholarshipCategory}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">Application Fee</p>
                                                        <p className="font-semibold">${scholarship.applicationFees}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">Service Charge</p>
                                                        <p className="font-semibold">${scholarship.serviceCharge}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">Payment Status</p>
                                                        <p className="font-semibold capitalize">{selectedApp?.paymentStatus}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">Application Status</p>
                                                        <p className="font-semibold capitalize">{selectedApp?.status}</p>
                                                    </div>

                                                    <div className="sm:col-span-2">
                                                        <p className="text-gray-500">Moderator Feedback</p>
                                                        <p className="font-semibold">
                                                            {selectedApp.feedback || "No feedback yet"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">Applied On</p>
                                                        <p className="font-semibold">
                                                            {new Date(selectedApp?.appliedDate).toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                </div>
                                            </>
                                        )}

                                        <div className="modal-action">
                                            <form method="dialog">
                                                <button className="btn" onClick={() => {
                                                    setScholarship(null);
                                                    setModalOpen(false);
                                                }}>
                                                    Close
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </dialog>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >

    );
};

export default MyApplications;