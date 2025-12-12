import React, { useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { Link } from "react-router";

const MyApplications = () => {
    const axiosInstance = useAxios();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

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
            <div className="flex justify-center py-10">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (applications.length === 0) {
        return <p className="text-center py-10 text-gray-500">You have not submitted any applications yet.</p>;
    }

    return (
        <div className="overflow-x-auto mt-6">
            <table className="table px-4">

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
                                <br />
                                <span className="badge badge-ghost badge-sm">
                                    {app.universityCountry}
                                </span>
                            </td>

                            {/* Status */}
                            <td>
                                <span
                                    className={`badge ${app.status === "approved"
                                        ? "badge-success"
                                        : app.status === "rejected"
                                            ? "badge-error"
                                            : "badge-warning"
                                        } badge-sm`}
                                         
                                >
                                    {app.status}
                                </span>
                            </td>

                            {/* Action Buttons */}
                            <td className="space-x-2 flex items-center">
                                {app.paymentStatus === "unpaid" && (
                                    <button
                                        className="btn btn-sm bg-indigo-600 text-white hover:bg-indigo-700"
                                        onClick={() => handlePay(app)}
                                    >
                                        Pay
                                    </button>
                                )}
                                <Link to={`/scholarships/${app.scholarshipId}`}>
                                    <button className="btn btn-primary btn-outline btn-sm"                                >
                                        Details
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
};

export default MyApplications;