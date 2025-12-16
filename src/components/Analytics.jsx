import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, } from "recharts";
import useAxios from "../hooks/useAxios";
import Loader from "./Loader";

const colors = ["#6366f1", "#22c55e", "#f97316", "#ef4444", "#06b6d4"];

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

    let totalFeesCollected = 0;

    for (let i = 0; i < applications.length; i++) {
        if (applications[i].paymentStatus === "paid") {
            totalFeesCollected += Number(applications[i].applicationFees || 0);
        }
    }

    // bar data
    const universityMap = {};
    applications.forEach((app) => {
        universityMap[app.universityName] =
            (universityMap[app.universityName] || 0) + 1;
    });

    const universityData = [];
    for (let key in universityMap) {
        universityData.push({
            name: key,
            applications: universityMap[key]
        });
    }


    // Pie data
    const categoryMap = {};
    scholarships.forEach((s) => {
        categoryMap[s.scholarshipCategory] =
            (categoryMap[s.scholarshipCategory] || 0) + 1;
    });

    const categoryData = [];
    for (let key in categoryMap) {
        categoryData.push({
            name: key,
            value: categoryMap[key]
        });
    }


    return (
        <div className="p-6 space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-xl p-6 border">
                    <p className="text-gray-500">Total Users</p>
                    <h2 className="text-3xl font-bold">{totalUsers}</h2>
                </div>

                <div className="bg-white shadow rounded-xl p-6 border">
                    <p className="text-gray-500">Total Scholarships</p>
                    <h2 className="text-3xl font-bold">{totalScholarships}</h2>
                </div>

                <div className="bg-white shadow rounded-xl p-6 border">
                    <p className="text-gray-500">Total Fees Collected</p>
                    <h2 className="text-3xl font-bold">${totalFeesCollected}</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Bar chart */}
                <div className="bg-white shadow rounded-xl p-6 border">
                    <h3 className="text-xl font-bold mb-4">
                        Applications per University
                    </h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={universityData}>
                            <XAxis dataKey="name" hide />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="applications" fill="#6366f1" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie */}
                <div className="bg-white shadow rounded-xl p-6 border">
                    <h3 className="text-xl font-bold mb-4">
                        Scholarships by Category
                    </h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {categoryData.map((_, index) => (
                                    <Cell key={index} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
