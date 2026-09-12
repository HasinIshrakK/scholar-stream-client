import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import AnalyticsDashboard from '../../../components/Analytics';
import Loader from '../../../components/Loader';
import useRole from '../../../hooks/useRole';
import useAuth from '../../../hooks/useAuth';
import useAxios from '../../../hooks/useAxios';
import {
    FaSearch, FaFileAlt, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaArrowRight
} from 'react-icons/fa';

const StatCard = ({ icon, label, value, accent }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-lg shrink-0 ${accent}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-semibold text-[#0F1B3C]" style={{ fontFamily: "'Fraunces', serif" }}>
                {value}
            </p>
            <p className="text-sm text-slate-500">{label}</p>
        </div>
    </div>
);

const DashboardHome = () => {
    const { user, loading } = useAuth();
    const { role, roleLoading } = useRole();
    const axiosInstance = useAxios();

    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        if (!user?.email || role === 'admin') {
            setStatsLoading(false);
            return;
        }

        const fetchApplications = async () => {
            setStatsLoading(true);
            try {
                // Assumes GET /applications can be filtered to the current user by
                // email. Adjust the param name/shape here if your API differs.
                const res = await axiosInstance.get('/applications', { params: { email: user.email } });
                const applications = res.data || [];
                setStats({
                    total: applications.length,
                    pending: applications.filter((a) => a.status === 'pending').length,
                    approved: applications.filter((a) => a.status === 'approved' || a.status === 'accepted').length,
                    rejected: applications.filter((a) => a.status === 'rejected').length,
                });
            } catch (err) {
                console.error('Failed to load application stats:', err);
                setStats(null);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchApplications();
    }, [axiosInstance, user, role]);

    if (loading || roleLoading) {
        return <Loader />;
    }

    const firstName = user?.displayName?.split(' ')[0];

    return (
        <div className="p-6 md:p-10" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="mb-10">
                <h1
                    className="text-3xl md:text-4xl font-semibold text-[#0F1B3C]"
                    style={{ fontFamily: "'Fraunces', serif" }}
                >
                    {firstName ? `Welcome back, ${firstName}` : 'Welcome to your dashboard'}
                </h1>
                <p className="text-slate-500 mt-2">
                    {role === 'admin'
                        ? "Here's how ScholarStream is performing right now."
                        : "Here's where things stand with your applications."}
                </p>
            </div>

            {role === 'admin' ? (
                <AnalyticsDashboard />
            ) : (
                <>
                    {!statsLoading && stats && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                            <StatCard
                                icon={<FaFileAlt />}
                                label="Applications"
                                value={stats.total}
                                accent="bg-[#0F1B3C]/5 text-[#0F1B3C]"
                            />
                            <StatCard
                                icon={<FaHourglassHalf />}
                                label="Pending"
                                value={stats.pending}
                                accent="bg-amber-50 text-amber-600"
                            />
                            <StatCard
                                icon={<FaCheckCircle />}
                                label="Approved"
                                value={stats.approved}
                                accent="bg-emerald-50 text-emerald-600"
                            />
                            <StatCard
                                icon={<FaTimesCircle />}
                                label="Rejected"
                                value={stats.rejected}
                                accent="bg-red-50 text-red-500"
                            />
                        </div>
                    )}

                    {statsLoading && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-[76px] bg-slate-100 animate-pulse rounded-xl" />
                            ))}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        <Link
                            to="/all-scholarships"
                            className="group bg-[#0F1B3C] text-white rounded-xl p-6 flex items-center justify-between hover:bg-[#16234F] transition-colors"
                        >
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Browse scholarships</h3>
                                <p className="text-slate-300 text-sm">Filter by field, country, and degree level.</p>
                            </div>
                            <FaSearch className="text-xl shrink-0 ml-4" />
                        </Link>

                        <Link
                            to="/dashboard/my-applications"
                            className="group bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between hover:border-[#C9A227] hover:shadow-md transition-all"
                        >
                            <div>
                                <h3 className="font-semibold text-lg text-[#0F1B3C] mb-1">My applications</h3>
                                <p className="text-slate-500 text-sm">Track status and complete pending payments.</p>
                            </div>
                            <FaArrowRight className="text-[#0F1B3C] shrink-0 ml-4" />
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardHome;
