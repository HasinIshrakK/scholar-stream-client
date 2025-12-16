import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Loader from "../../../components/Loader";
import useAxios from "../../../hooks/useAxios";

const Failed = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const res = await axiosInstance.get(`/applications/${id}`);
                setData(res.data);
            } catch (err) {
                alert(err)
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [id, axiosInstance, navigate]);

    if (loading) return <Loader />;

    return (
        <div className="max-w-xl mx-auto mt-20 p-6 bg-base-100 shadow rounded text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
                Payment Failed ❌
            </h2>
            <div className="space-y-2 text-left mb-6">
                <p><strong>Scholarship:</strong> {data.scholarshipName}</p>
                <p><strong>University:</strong> {data.universityName}</p>
                <p className="text-sm text-gray-500">Your payment was not completed. Please try again.</p>
            </div>
            <button onClick={() => navigate("/dashboard/my-applications")} className="btn btn-primary w-full">
                Return to Dashboard
            </button>
        </div>
    );
};

export default Failed;