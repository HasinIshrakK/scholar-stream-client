import React, { useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { Link } from "react-router";
import Swal from "sweetalert2";
import Loader from "../../../components/Loader";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageScholarships = () => {
    const axiosInstance = useAxios();
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                const res = await axiosInstance.get("/scholarships");
                setScholarships(res.data);
            } catch (err) {
                console.error("FETCH SCHOLARSHIPS ERROR:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchScholarships();
    }, [axiosInstance]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This scholarship will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            theme: "auto"
        });

        if (!result.isConfirmed) return;

        try {
            await axiosInstance.delete(`/scholarships/${id}`);

            setScholarships((prev) =>
                prev.filter((sch) => sch._id !== id)
            );

            Swal.fire({
                icon: "success",
                title: "Deleted",
                text: "Scholarship has been deleted",
                theme: "auto"
            });
        } catch (error) {
            console.error("DELETE ERROR:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to delete scholarship",
                theme: 'auto'
            });
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="overflow-x-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Manage Scholarships</h2>

            {scholarships.length === 0 ? (
                <p className="text-center text-gray-500">
                    No scholarships found.
                </p>
            ) : (
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Scholarship</th>
                            <th>University</th>
                            <th>Degree</th>
                            <th>Category</th>
                            <th>Fees</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {scholarships.map((sch, i) => (
                            <tr key={sch._id}>
                                <th>{i + 1}</th>

                                <td>
                                    <div className="font-semibold">
                                        {sch.scholarshipName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {sch.subjectCategory}
                                    </div>
                                </td>

                                <td>{sch.universityName}</td>
                                <td>{sch.degree}</td>
                                <td>{sch.scholarshipCategory}</td>

                                <td>
                                    <span className="badge badge-outline">
                                        ${sch.applicationFees}
                                    </span>
                                </td>

                                <td>
                                    {new Date(sch.applicationDeadline).toLocaleDateString()}
                                </td>

                                <td className="flex gap-2">
                                    <Link to={`/dashboard/edit-scholarship/${sch._id}`} className="btn btn-sm btn-primary text-white">
                                        <FaEdit />
                                    </Link>

                                    <button onClick={() => handleDelete(sch._id)} className="btn btn-sm bg-red-500 text-white">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ManageScholarships;