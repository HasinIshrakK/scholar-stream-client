import React, { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import Loader from "./Loader";

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

    const totalFeesCollected = applications.reduce(
        (sum, app) =>
            app.paymentStatus === "paid"
                ? sum + Number(app.applicationFees || 0)
                : sum,
        0
    );

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

        </div>
    );
};

export default Analytics;
