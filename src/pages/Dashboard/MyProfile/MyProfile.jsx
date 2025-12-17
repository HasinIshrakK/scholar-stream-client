import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import useRole from "../../../hooks/useRole";

const MyProfile = () => {
    const { loading } = useAuth();
    const { user, logout } = useContext(AuthContext);
    const { role, roleLoading } = useRole()

    if (loading || roleLoading) {
        return <Loader></Loader>
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Page title */}
            <div className="max-w-4xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-indigo-700">My Profile</h1>
                <p className="text-gray-600 mt-1">Manage your personal information and settings.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 border">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

                    {/* User */}
                    <div className="flex flex-col items-center">
                        <div className="avatar">
                            <div className="w-32 h-32 rounded-full ring ring-indigo-500 ring-offset-2">
                                <img
                                    src={user?.photoURL || "https://i.ibb.co/KjGgLZt/avatar.png"}
                                    alt="User Avatar"
                                />
                            </div>
                        </div>
                        {/* I may apply it if I get time and make edit profile page */}
                        {/* <button
                            className="mt-4 text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Change Photo
                        </button> */}
                    </div>

                    <div className="flex-1">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
                            <div className="p-4 border rounded-lg bg-gray-50">
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="font-semibold">{user?.displayName || "Not Provided"}</p>
                            </div>

                            <div className="p-4 border rounded-lg bg-gray-50">
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-semibold break-all">{user?.email}</p>
                            </div>

                            <div className="p-4 border rounded-lg bg-gray-50">
                                <p className="text-sm text-gray-500">Account Type</p>
                                <p className="font-semibold capitalize">{role || "Student"}</p>
                            </div>

                            <div className="p-4 border rounded-lg bg-gray-50">
                                <p className="text-sm text-gray-500">Member Since</p>
                                <p className="font-semibold">
                                    {user?.metadata?.creationTime
                                        ? new Date(user.metadata.creationTime).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link to="/dashboard/edit-profile" className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"                           >
                                Edit Profile
                            </Link>

                            <Link to="/dashboard/my-applications" className="px-5 py-2 btn btn-primary btn-outline"                            >
                                My Applied Scholarships
                            </Link>

                            <button onClick={logout} className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-auto">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
