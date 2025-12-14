import React, { useContext, useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { AuthContext } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";
import Loader from "../../../components/Loader";

const AllApplications = () => {
    const axiosInstance = useAxios();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scholarship, setScholarship] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axiosInstance.get('/applications');
                setApplications(response.data);
                // console.log(feedback);
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [axiosInstance, applications, feedback]);

    if (loading) {
        return (
            <Loader />
        );
    }

    if (applications.length === 0) {
        return <p className="text-center py-10 text-gray-500">You have not submitted any applications yet.</p>;
    }

    const handleReject = async (appId, newStatus) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, reject it!",
            theme: "auto",
        });

        if (!result.isConfirmed) return;

        try {
            await axiosInstance.patch(`/applications/${appId}`, {
                status: newStatus,
            });

            setApplications(prev =>
                prev.map(app =>
                    app._id === appId
                        ? { ...app, status: newStatus }
                        : app
                )
            );

            Swal.fire({
                title: "Rejected!",
                text: "This application has been rejected.",
                icon: "success",
                theme: "auto",
            });

        } catch (error) {
            console.error("REJECT ERROR:", error.response?.data || error);
            Swal.fire({
                title: "Error!",
                text: "Failed to reject application. Please try again.",
                icon: "error",
                theme: "auto",
            });
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
                text: "This application has been deleted.",
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

    const handleFeedbackSubmit = async (app, newFeedback) => {
        if (!feedback) {
            return alert("Please write a feedback.");
        }

        try {
            await axiosInstance.patch(`/applications/${app._id}`, {
                feedback: newFeedback,
            });

            setApplications(prev =>
                prev.map(a =>
                    a._id === app._id
                        ? { ...a, feedback: newFeedback }
                        : a
                )
            );

            alert("Feedback submitted successfully!");
            document.getElementById(`feedback-${app._id}`).close();

            setFeedback("");

        } catch (err) {
            console.error("Feedback submission error:", err);
            alert("Failed to submit feedback. Please try again.");
        }
    };

    const handleStatusChange = async (appId, newStatus) => {
        try {
            await axiosInstance.patch(`/applications/${appId}`, {
                status: newStatus,
            });

            setApplications(prev =>
                prev.map(app =>
                    app._id === appId
                        ? { ...app, status: newStatus }
                        : app
                )
            );

            Swal.fire({
                icon: "success",
                title: "Status Updated",
                text: `Application marked as ${newStatus}`,
                timer: 1500,
                theme: 'auto',
                showConfirmButton: false,
            });

        } catch (error) {
            console.error("STATUS UPDATE ERROR:", error);
            Swal.fire("Error", "Failed to update status", "error");
        }
    };


    return (
        <div className="overflow-x-auto mt-6">
            <table className="table px-4">

                <thead>
                    <tr>
                        <th></th>
                        <th>Applicant<br></br> Name</th>
                        <th>Applicant<br></br> Email</th>
                        <th>University<br></br> Name</th>
                        <th>Application Feedback</th>
                        <th>Application<br></br> Status</th>
                        <th>Payment<br></br> Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {applications.map((app, index) => (
                        <tr key={app._id}>
                            <th>{index + 1}</th>

                            {/* Applicant Info */}
                            <td>
                                <span>
                                    {app.userName}
                                </span>
                            </td>
                            <td>
                                <span>
                                    {app.userEmail}
                                </span>
                            </td>

                            {/* University Name */}
                            <td>
                                {app.universityName}
                            </td>

                            {/* Application Feedback */}
                            <td className="w-10">
                                <span>
                                    {app.feedback || 'No Feedback Yet'}
                                </span>
                            </td>

                            {/* Application Status */}
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

                            {/* Payment Status */}
                            <td>
                                <span
                                    className={`badge capitalize ${app.paymentStatus === "paid"
                                        ? "badge-success"
                                        : "badge-warning"
                                        } badge-sm text-white`}

                                >
                                    {app.paymentStatus}
                                </span>
                            </td>

                            {/* Actions */}
                            <td className="grid grid-cols-1 gap-2 items-center">
                                <div className="lg:hidden">
                                    <select defaultValue="Update Status" value={app.status} onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                        className="select select-primary select-sm">
                                        <option disabled={true}>Application Status</option>
                                        <option value="pending">Processing</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-primary btn-outline btn-sm"
                                        onClick={async () => {
                                            setSelectedApp(app);
                                            const res = await axiosInstance.get(`/scholarships/${app.scholarshipId}`);
                                            setScholarship(res.data);
                                            document.getElementById("details_modal").showModal();
                                        }}
                                    >
                                        Details
                                    </button>
                                    <dialog id={`feedback-${app._id}`} className="modal">
                                        <form method="dialog" className="modal-box">
                                            <h3 className="font-bold text-lg mb-4">Write a Feedback</h3>

                                            <div className="flex flex-col gap-3">

                                                <label className="font-semibold text-sm">Feedback</label>
                                                <textarea
                                                    className="textarea textarea-bordered w-full" rows={4}
                                                    placeholder="Write your feedback..." value={feedback || ""}
                                                    onChange={(e) =>
                                                        setFeedback(e.target.value)} />
                                            </div>

                                            <div className="modal-action">
                                                <button type="button"
                                                    className="btn btn-primary" onClick={() => handleFeedbackSubmit(app, feedback)}>
                                                    Submit
                                                </button>
                                                <button className="btn">Cancel</button>
                                            </div>
                                        </form>
                                    </dialog>
                                    <select defaultValue="Update Status" value={app.status} onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                        className="select select-primary select-sm hidden lg:block">
                                        <option disabled={true}>Application Status</option>
                                        <option value="pending">Processing</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <button
                                        className="btn btn-sm bg-indigo-600 text-white hover:bg-indigo-700"
                                        onClick={() => document.getElementById(`feedback-${app._id}`).showModal()}>
                                        Feedback
                                    </button>
                                    {app.status === "pending" && (
                                        <button className="btn btn-sm bg-red-500 text-white"
                                            onClick={() => handleReject(app._id, 'rejected')}                                    >
                                            Reject
                                        </button>
                                    )}
                                    {app.status !== "pending" && (
                                        <button className="btn btn-sm btn-error text-white"
                                            onClick={() => handleDelete(app)}                                    >
                                            Delete
                                        </button>
                                    )}
                                </div>

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
                                                        <p className="text-gray-500">Applicant Name</p>
                                                        <p className="font-semibold">{app.userName}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">Applicant Email</p>
                                                        <p className="font-semibold">{app.userEmail}</p>
                                                    </div>

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
                                                            {selectedApp?.feedback || "No feedback yet"}
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

export default AllApplications;