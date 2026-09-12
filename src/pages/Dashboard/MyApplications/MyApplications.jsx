import React, { useContext, useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { Link } from "react-router";
import { AuthContext } from "../../../contexts/AuthContext";
import { FaEdit, FaFileAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import Loader from "../../../components/Loader";

const STATUS_BADGE = {
    completed: "badge-success",
    rejected: "badge-error",
};

const MyApplications = () => {
    const axiosInstance = useAxios();
    const { user } = useContext(AuthContext);

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [scholarship, setScholarship] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState(false);

    const [reviewRating, setReviewRating] = useState({});
    const [reviewComment, setReviewComment] = useState({});
    const [submittingReviewId, setSubmittingReviewId] = useState(null);
    const [payingId, setPayingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (!user?.email) return;

        const fetchApplications = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/applications?email=${user.email}`);
                setApplications(response.data);
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
        // NOTE: `applications` was previously in this dependency array, which
        // re-triggers this effect every time setApplications runs inside it —
        // an infinite fetch loop. It must stay out.
    }, [user?.email, axiosInstance]);

    const openDetails = async (app) => {
        setSelectedApp(app);
        setScholarship(null);
        setDetailsError(false);
        setDetailsLoading(true);
        document.getElementById("details_modal").showModal();
        try {
            const res = await axiosInstance.get(`/scholarships/${app.scholarshipId}`);
            setScholarship(res.data);
        } catch (err) {
            console.error("Failed to load scholarship details:", err);
            setDetailsError(true);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handlePay = async (app) => {
        setPayingId(app._id);
        try {
            const res = await axiosInstance.post('/create-checkout-session', {
                // TODO: this should reflect the scholarship's real application fee.
                // Applications aren't currently created with an `applicationFees`
                // field (see the apply flow on the scholarship details page), so
                // this falls back to a flat $50 for every scholarship today.
                applicationFees: app.applicationFees ?? 50,
                scholarshipName: app.scholarshipName,
                userEmail: user.email,
                applicationId: app._id,
            });
            window.location.href = res.data.url;
        } catch (error) {
            console.error("PAY ERROR:", error.response?.data || error);
            Swal.fire({
                title: "Payment couldn't start",
                text: "Something went wrong starting the checkout. Please try again.",
                icon: "error",
            });
        } finally {
            setPayingId(null);
        }
    };

    const handleDelete = async (app) => {
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

        setDeletingId(app._id);
        try {
            await axiosInstance.delete(`/applications/${app._id}`);
            // Fixed: the original filter callback shadowed `app`, comparing
            // each item's _id to itself (`app._id !== app._id`), which is
            // always false and wiped out the entire list on every delete.
            setApplications((prev) => prev.filter((a) => a._id !== app._id));

            Swal.fire({ title: "Deleted!", text: "Your application has been deleted.", icon: "success", theme: "auto" });
        } catch (error) {
            console.error("DELETE ERROR:", error.response?.data || error);
            Swal.fire({ title: "Error!", text: "Failed to delete application. Please try again.", icon: "error", theme: "auto" });
        } finally {
            setDeletingId(null);
        }
    };

    const handleRevSubmit = async (app) => {
        const rating = reviewRating[app._id];
        const comment = reviewComment[app._id];

        if (!rating || !comment) {
            Swal.fire({ title: "Almost there", text: "Please select a rating and write a comment.", icon: "info" });
            return;
        }

        setSubmittingReviewId(app._id);
        try {
            await axiosInstance.post("/reviews", {
                scholarshipId: app.scholarshipId,
                scholarshipName: app.scholarshipName,
                universityName: app.universityName,
                userName: user.displayName || "Anonymous",
                userEmail: user.email,
                userImage: user.photoURL || "/user.png",
                ratingPoint: parseInt(rating),
                reviewComment: comment,
                reviewDate: new Date().toISOString(),
            });

            document.getElementById(`review-${app._id}`).close();
            setReviewRating((prev) => ({ ...prev, [app._id]: "" }));
            setReviewComment((prev) => ({ ...prev, [app._id]: "" }));

            Swal.fire({ title: "Thank you!", text: "Your review was submitted.", icon: "success" });
        } catch (err) {
            console.error("Review submission error:", err);
            Swal.fire({ title: "Error", text: "Failed to submit review. Please try again.", icon: "error" });
        } finally {
            setSubmittingReviewId(null);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (applications.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="text-center max-w-sm">
                    <div className="w-12 h-12 rounded-full bg-[#0F1B3C]/5 text-[#0F1B3C] flex items-center justify-center mx-auto mb-4 text-lg">
                        <FaFileAlt />
                    </div>
                    <h3 className="font-semibold text-lg text-[#0F1B3C] mb-1">No applications yet</h3>
                    <p className="text-slate-500 text-sm mb-6">Once you apply to a scholarship, you'll be able to track it here.</p>
                    <Link
                        to="/all-scholarships"
                        className="inline-block px-5 py-2.5 bg-[#0F1B3C] text-white rounded-lg font-medium text-sm hover:bg-[#16234F] transition-colors"
                    >
                        Browse scholarships
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
                My Applications
            </h1>

            <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                <table className="table">
                    <thead>
                        <tr className="text-slate-500 text-xs uppercase tracking-wide">
                            <th></th>
                            <th>Scholarship</th>
                            <th>University</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {applications.map((app, index) => (
                            <tr key={app._id} className="hover:bg-slate-50">
                                <th className="text-slate-400">{index + 1}</th>

                                <td>
                                    <div className="font-semibold text-[#0F1B3C]">{app.scholarshipName}</div>
                                    <div className="text-sm text-slate-400">{app.degree}</div>
                                </td>

                                <td className="text-slate-600">{app.universityName}</td>

                                <td>
                                    <span className={`badge capitalize text-white ${STATUS_BADGE[app.status] || "badge-warning"} badge-sm`}>
                                        {app.status}
                                    </span>
                                </td>

                                <td>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {app.status === "pending" && (
                                            <Link
                                                to={`/dashboard/edit/${app.scholarshipId}`}
                                                className="text-[#0F1B3C] hover:text-[#C9A227] text-xl"
                                                aria-label="Edit application"
                                            >
                                                <FaEdit />
                                            </Link>
                                        )}

                                        <button
                                            className="btn btn-sm border border-slate-200 bg-white text-[#0F1B3C] hover:border-[#C9A227] hover:bg-white"
                                            onClick={() => openDetails(app)}
                                        >
                                            Details
                                        </button>

                                        {app.paymentStatus === "unpaid" && app.status === "pending" && (
                                            <button
                                                className="btn btn-sm bg-[#0F1B3C] text-white hover:bg-[#16234F] border-none disabled:opacity-70"
                                                disabled={payingId === app._id}
                                                onClick={() => handlePay(app)}
                                            >
                                                {payingId === app._id ? "Redirecting..." : "Pay"}
                                            </button>
                                        )}

                                        {app.status === "completed" && (
                                            <>
                                                <button
                                                    className="btn btn-sm bg-[#0F1B3C] text-white hover:bg-[#16234F] border-none"
                                                    onClick={() => document.getElementById(`review-${app._id}`).showModal()}
                                                >
                                                    Add a review
                                                </button>
                                                <dialog id={`review-${app._id}`} className="modal">
                                                    <form method="dialog" className="modal-box">
                                                        <h3 className="font-bold text-lg mb-4 text-[#0F1B3C]" style={{ fontFamily: "'Fraunces', serif" }}>
                                                            Add a review for {app.scholarshipName}
                                                        </h3>

                                                        <div className="flex flex-col gap-3">
                                                            <label className="font-semibold text-sm text-slate-600">Rating</label>
                                                            <select
                                                                className="select select-bordered w-full"
                                                                value={reviewRating[app._id] || ""}
                                                                onChange={(e) => setReviewRating((prev) => ({ ...prev, [app._id]: e.target.value }))}
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
                                                                value={reviewComment[app._id] || ""}
                                                                onChange={(e) => setReviewComment((prev) => ({ ...prev, [app._id]: e.target.value }))}
                                                            />
                                                        </div>

                                                        <div className="modal-action">
                                                            <button
                                                                type="button"
                                                                disabled={submittingReviewId === app._id}
                                                                className="btn bg-[#0F1B3C] text-white hover:bg-[#16234F] border-none disabled:opacity-70"
                                                                onClick={() => handleRevSubmit(app)}
                                                            >
                                                                {submittingReviewId === app._id ? "Submitting..." : "Submit"}
                                                            </button>
                                                            <button className="btn">Cancel</button>
                                                        </div>
                                                    </form>
                                                </dialog>
                                            </>
                                        )}

                                        {app.status === "pending" && (
                                            <button
                                                className="btn btn-sm bg-red-600 text-white hover:bg-red-700 border-none disabled:opacity-70"
                                                disabled={deletingId === app._id}
                                                onClick={() => handleDelete(app)}
                                            >
                                                {deletingId === app._id ? "Deleting..." : "Delete"}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Details modal — rendered once, outside the row loop.
                Previously this was duplicated per-row with the same hardcoded
                id="details_modal", which is invalid (duplicate DOM ids) and
                meant only the first row's dialog element was ever controlled. */}
            <dialog id="details_modal" className="modal">
                <div className="modal-box max-w-3xl">
                    {detailsLoading ? (
                        <Loader />
                    ) : detailsError ? (
                        <p className="text-slate-500 py-10 text-center">Couldn't load these details. Please try again.</p>
                    ) : (
                        <>
                            <h3 className="font-bold text-xl mb-4 text-[#0F1B3C]" style={{ fontFamily: "'Fraunces', serif" }}>
                                Application details
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-500">Scholarship</p>
                                    <p className="font-semibold text-[#0F1B3C]">{scholarship?.scholarshipName}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">University</p>
                                    <p className="font-semibold text-[#0F1B3C]">{scholarship?.universityName}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Degree</p>
                                    <p className="font-semibold text-[#0F1B3C]">{scholarship?.degree}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Category</p>
                                    <p className="font-semibold text-[#0F1B3C]">{scholarship?.scholarshipCategory}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Application fee</p>
                                    <p className="font-semibold text-[#0F1B3C]">${scholarship?.applicationFees}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Service charge</p>
                                    <p className="font-semibold text-[#0F1B3C]">${scholarship?.serviceCharge}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Payment status</p>
                                    <p className="font-semibold capitalize text-[#0F1B3C]">{selectedApp?.paymentStatus}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Application status</p>
                                    <p className="font-semibold capitalize text-[#0F1B3C]">{selectedApp?.status}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-slate-500">Moderator feedback</p>
                                    <p className="font-semibold text-[#0F1B3C]">{selectedApp?.feedback || "No feedback yet"}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Applied on</p>
                                    <p className="font-semibold text-[#0F1B3C]">
                                        {selectedApp?.appliedDate ? new Date(selectedApp.appliedDate).toLocaleDateString() : "—"}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="modal-action">
                        <form method="dialog">
                            <button
                                className="btn"
                                onClick={() => {
                                    setScholarship(null);
                                    setSelectedApp(null);
                                }}
                            >
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default MyApplications;