import React, { useContext, useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { Link } from "react-router";
import { AuthContext } from "../../../contexts/AuthContext";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import Loader from "../../../components/Loader";

const AllApplications = () => {
    const axiosInstance = useAxios();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scholarship, setScholarship] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [feedback, setFeedback] = useState({});
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axiosInstance.get('/applications');
                setApplications(response.data);
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [axiosInstance]);

    if (loading) {
        return (
            <Loader />
        );
    }

    if (applications.length === 0) {
        return <p className="text-center py-10 text-gray-500">You have not submitted any applications yet.</p>;
    }

    const handleCancel = async (app) => {
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

            Swal.fire({
                title: "Rejected!",
                text: "This application has been rejected.",
                icon: "success",
                theme: "auto",
            });

        } catch (error) {
            console.error("CANCEL ERROR:", error.response?.data || error);
            Swal.fire({
                title: "Error!",
                text: "Failed to reject application. Please try again.",
                icon: "error",
                theme: "auto",
            });
        }
    };

    const handleFeedbackSubmit = async (app) => {
        const comment = feedback[app._id];

        if (!comment) {
            return alert("Please write a feedback.");
        }

        try {
            // await axiosInstance.patch("/", {

            // });

            alert("Feedback submitted successfully!");
            document.getElementById(`feedback-${app._id}`).close();

            setFeedback((prev) => ({ ...prev, [app._id]: "" }));

        } catch (err) {
            console.error("Feedback submission error:", err);
            alert("Failed to submit feedback. Please try again.");
        }
    };

    return (
        <div className="overflow-x-auto mt-6">
            <table className="table px-4">

                <thead>
                    <tr>
                        <th></th>
                        <th>Applicant Name</th>
                        <th>Applicant<br></br> Email</th>
                        <th>University Name</th>
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
                                <div>
                                    Name
                                </div>
                            </td>
                            <td>
                                <div>
                                    email
                                </div>
                            </td>

                            {/* University Name */}
                            <td>
                                {app.universityName}
                                <br />
                                <span className="badge badge-ghost badge-sm">
                                    {app.universityCountry}
                                </span>
                            </td>

                            {/* Application Feedback */}
                            <td>
                                <div>
                                    feedback
                                </div>
                            </td>

                            {/* Application Status */}
                            <td>
                                <span
                                    className={`badge ${app.status === "completed"
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
                                    className={`badge ${app.paymentStatus === "paid"
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
                                    <select defaultValue="Update Status" className="select select-primary select-sm">
                                        <option disabled={true}>Application Status</option>
                                        <option>Processing</option>
                                        <option>Completed</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={async () => {
                                        setModalOpen(true);
                                        const res = await axiosInstance.get(`/scholarships/${app.scholarshipId}`);
                                        setScholarship(res.data);
                                        document.getElementById("details_modal").showModal();
                                    }}
                                        className="btn btn-primary btn-outline btn-sm">
                                        Details
                                    </button>
                                    <select defaultValue="Update Status" className="select select-primary select-sm hidden lg:block">
                                        <option disabled={true}>Application Status</option>
                                        <option>Processing</option>
                                        <option>Completed</option>
                                    </select>
                                    <button
                                        className="btn btn-sm bg-indigo-600 text-white hover:bg-indigo-700"
                                        onClick={() => document.getElementById(`review-${app._id}`).showModal()}>
                                        Give a feedback
                                    </button>
                                    <button className="btn btn-sm bg-red-500 text-white"
                                        onClick={() => handleCancel(app)}                                    >
                                        Cancel
                                    </button>
                                </div>
                                <dialog id={`review-${app._id}`} className="modal">
                                    <form method="dialog" className="modal-box">
                                        <h3 className="font-bold text-lg mb-4">Write a Feedback for</h3>

                                        <div className="flex flex-col gap-3">

                                            <label className="font-semibold text-sm">Feedback</label>
                                            <textarea
                                                className="textarea textarea-bordered w-full" rows={4}
                                                placeholder="Write your feedback..." value={feedback[app._id] || ""}
                                                onChange={(e) =>
                                                    setFeedback((prev) => ({ ...prev, [app._id]: e.target.value }))} />
                                        </div>

                                        <div className="modal-action">
                                            <button type="button"
                                                className="btn btn-primary" onClick={() => handleFeedbackSubmit(app)}>
                                                Submit
                                            </button>
                                            <button className="btn">Cancel</button>
                                        </div>
                                    </form>
                                </dialog>

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
                                                        <p className="font-semibold capitalize">{app.paymentStatus}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">Application Status</p>
                                                        <p className="font-semibold capitalize">{app.status}</p>
                                                    </div>

                                                    <div className="sm:col-span-2">
                                                        <p className="text-gray-500">Moderator Feedback</p>
                                                        <p className="font-semibold">
                                                            {scholarship.feedback || "No feedback yet"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">Applied On</p>
                                                        <p className="font-semibold">
                                                            {new Date(app.appliedDate).toLocaleDateString()}
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