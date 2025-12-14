import React, { useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import Swal from "sweetalert2";
import Loader from "../../../components/Loader";

const ManageUsers = () => {
    const axiosInstance = useAxios();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState("all");

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const res = await axiosInstance.get("/users");
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [axiosInstance, roleFilter, users]);

    const handleRoleChange = async (userId, newRole) => {
        const result = await Swal.fire({
            title: "Change role?",
            text: `Set role to "${newRole}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, change it",
            theme: "auto",
        });

        if (!result.isConfirmed) return;

        try {
            await axiosInstance.patch(`/users/${userId}`, { role: newRole });

            setUsers(prev =>
                prev.map(user =>
                    user._id === userId ? { ...user, role: newRole } : user
                )
            );

            Swal.fire("Updated!", "User role updated.", "success");
        } catch (err) {
            console.error("Role update failed", err);
            Swal.fire("Error!", "Failed to update role.", "error");
        }
    };

    const handleDeleteUser = async (userId) => {
        const result = await Swal.fire({
            title: "Delete user?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Delete",
            theme: "auto",
        });

        if (!result.isConfirmed) return;

        try {
            await axiosInstance.delete(`/users/${userId}`);
            setUsers(prev => prev.filter(user => user._id !== userId));

            Swal.fire("Deleted!", "User has been removed.", "success");
        } catch (err) {
            console.error("Delete failed", err);
            Swal.fire("Error!", "Failed to delete user.", "error");
        }
    };

    const filteredUsers = roleFilter === "all" ? users : users.filter(user => user.role === roleFilter);

    if (loading) return <Loader />;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manage Users</h2>

                <select className="select select-bordered" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                    <option value="all">All Roles</option>
                    <option value="student">Student</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {filteredUsers.length === 0 ? (
                <p className="text-center text-gray-500 py-10">
                    No users found.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th className="hidden md:block">Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>

                                    <td className="flex items-center gap-3">
                                        <img src={user.photo || "https://i.pravatar.cc/40"} alt="user" className="w-10 h-10 rounded-full hidden sm:block" />
                                        <div className="flex flex-col">
                                            <span className="font-semibold">
                                                {user.name || "Unnamed"}
                                            </span>
                                            <span className="md:hidden">
                                                {user.email}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="hidden md:table-cell">{user.email}</td>

                                    <td>
                                        <span className="badge capitalize">
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="flex gap-2">
                                        <select className="select select-sm select-bordered" value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                                            <option value="student">Student</option>
                                            <option value="moderator">Moderator</option>
                                            <option value="admin">Admin</option>
                                        </select>

                                        <button className="btn btn-sm btn-error" onClick={() => handleDeleteUser(user._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;