import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import useRole from "../../../hooks/useRole";
import { FaSignOutAlt, FaFileAlt } from "react-icons/fa";

const InfoTile = ({ label, value }) => (
    <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="font-semibold text-[#0F1B3C] break-words">{value}</p>
    </div>
);

const MyProfile = () => {
    const { loading } = useAuth();
    const { user, logout } = useContext(AuthContext);
    const { role, roleLoading } = useRole();
    const navigate = useNavigate();

    if (loading || roleLoading) {
        return <Loader />;
    }

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-[#FAF9F5] p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Page title */}
            <div className="max-w-4xl mx-auto mb-8">
                <h1
                    className="text-3xl font-semibold text-[#0F1B3C]"
                    style={{ fontFamily: "'Fraunces', serif" }}
                >
                    My Profile
                </h1>
                <p className="text-slate-500 mt-1">Manage your personal information and settings.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-6 border border-slate-200">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

                    {/* User */}
                    <div className="flex flex-col items-center shrink-0">
                        <div className="avatar">
                            <div className="w-32 h-32 rounded-full ring ring-[#C9A227] ring-offset-2 ring-offset-white">
                                <img
                                    src={user?.photoURL || "https://i.ibb.co/KjGgLZt/avatar.png"}
                                    alt="User avatar"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoTile label="Full name" value={user?.displayName || "Not provided"} />
                            <InfoTile label="Email" value={user?.email} />
                            <InfoTile label="Account type" value={<span className="capitalize">{role || "Student"}</span>} />
                            <InfoTile
                                label="Member since"
                                value={
                                    user?.metadata?.creationTime
                                        ? new Date(user.metadata.creationTime).toLocaleDateString()
                                        : "N/A"
                                }
                            />
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <div className="tooltip" data-tip="Profile editing is coming soon">
                                <button
                                    disabled
                                    className="px-5 py-2.5 rounded-lg font-medium text-sm bg-slate-100 text-slate-400 cursor-not-allowed"
                                >
                                    Edit profile
                                </button>
                            </div>

                            <Link
                                to="/dashboard/my-applications"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm border border-slate-200 text-[#0F1B3C] hover:border-[#2745c9] hover:border-2 transition-colors"
                            >
                                <FaFileAlt className="text-xs" /> My applied scholarships
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm bg-red-600 text-white hover:bg-red-700 transition-colors ml-auto"
                            >
                                <FaSignOutAlt className="text-xs" /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;