import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";
import useAxios from "../hooks/useAxios";
import Loader from "./Loader";
import { FaUsers, FaGraduationCap, FaCoins, FaHourglassHalf } from "react-icons/fa";

const CHART_COLORS = ["#0F1B3C", "#C9A227", "#1F6F6B", "#94A3B8", "#B45309", "#7C6FA6"];

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white shadow-sm rounded-xl p-6 border border-slate-200 flex items-center gap-4">
        <div className="w-11 h-11 rounded-lg bg-[#0F1B3C]/5 text-[#0F1B3C] flex items-center justify-center text-lg shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-slate-500 text-sm">{label}</p>
            <h2 className="text-2xl font-semibold text-[#0F1B3C]" style={{ fontFamily: "'Fraunces', serif" }}>
                {value}
            </h2>
        </div>
    </div>
);

const ChartCard = ({ title, isEmpty, emptyLabel, children }) => (
    <div className="bg-white shadow-sm rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-[#0F1B3C] mb-4" style={{ fontFamily: "'Fraunces', serif" }}>
            {title}
        </h3>
        {isEmpty ? (
            <div className="h-[300px] flex items-center justify-center text-slate-400 text-sm">
                {emptyLabel}
            </div>
        ) : children}
    </div>
);

const truncate = (name, max = 14) =>
    name && name.length > max ? `${name.slice(0, max)}…` : name;

const BarTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, applications } = payload[0].payload;
    return (
        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm text-sm">
            <p className="font-semibold text-[#0F1B3C]">{name}</p>
            <p className="text-slate-500">{applications} application{applications === 1 ? "" : "s"}</p>
        </div>
    );
};

const Analytics = () => {
    const axiosInstance = useAxios();

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [scholarships, setScholarships] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [uRes, sRes, aRes] = await Promise.all([
                    axiosInstance.get("/users"),
                    axiosInstance.get("/scholarships"),
                    axiosInstance.get("/applications"),
                ]);

                setUsers(uRes.data);
                setScholarships(sRes.data);
                setApplications(aRes.data);
            } catch (err) {
                console.error("ANALYTICS FETCH ERROR:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [axiosInstance]);

    if (loading) return <Loader />;

    const totalUsers = users.length;
    const totalScholarships = scholarships.length;
    const pendingApplications = applications.filter((a) => a.status === "pending").length;

    let totalFeesCollected = 0;
    for (let i = 0; i < applications.length; i++) {
        if (applications[i].paymentStatus === "paid") {
            totalFeesCollected += Number(applications[i].applicationFees || 0);
        }
    }

    // Bar data — top 8 universities by application count, sorted descending
    const universityMap = {};
    applications.forEach((app) => {
        if (!app.universityName) return;
        universityMap[app.universityName] = (universityMap[app.universityName] || 0) + 1;
    });

    const universityData = Object.entries(universityMap)
        .map(([name, applications]) => ({ name, applications }))
        .sort((a, b) => b.applications - a.applications)
        .slice(0, 8);

    // Pie data
    const categoryMap = {};
    scholarships.forEach((s) => {
        if (!s.scholarshipCategory) return;
        categoryMap[s.scholarshipCategory] = (categoryMap[s.scholarshipCategory] || 0) + 1;
    });

    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    return (
        <div className="p-6 space-y-8" style={{ fontFamily: "'Inter', sans-serif" }}>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<FaUsers />} label="Total users" value={totalUsers.toLocaleString()} />
                <StatCard icon={<FaGraduationCap />} label="Total scholarships" value={totalScholarships.toLocaleString()} />
                <StatCard icon={<FaHourglassHalf />} label="Pending applications" value={pendingApplications.toLocaleString()} />
                <StatCard icon={<FaCoins />} label="Fees collected" value={`$${totalFeesCollected.toLocaleString()}`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Bar chart */}
                <ChartCard
                    title="Applications per university"
                    isEmpty={universityData.length === 0}
                    emptyLabel="No applications yet."
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={universityData} margin={{ bottom: 40 }}>
                            <CartesianGrid vertical={false} stroke="#F1F5F9" />
                            <XAxis
                                dataKey="name"
                                interval={0}
                                angle={-35}
                                textAnchor="end"
                                height={60}
                                tick={{ fontSize: 11, fill: "#64748B" }}
                                tickFormatter={(name) => truncate(name)}
                            />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748B" }} />
                            <Tooltip content={<BarTooltip />} cursor={{ fill: "#0F1B3C0D" }} />
                            <Bar dataKey="applications" fill="#0F1B3C" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Pie */}
                <ChartCard
                    title="Scholarships by category"
                    isEmpty={categoryData.length === 0}
                    emptyLabel="No scholarships yet."
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="45%"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={2}
                            >
                                {categoryData.map((_, index) => (
                                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name) => [`${value} scholarship${value === 1 ? "" : "s"}`, name]} />
                            <Legend
                                verticalAlign="bottom"
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ fontSize: 12, color: "#475569" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};

export default Analytics;