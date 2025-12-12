import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxios from "../../hooks/useAxios"

const Home = () => {

    const [topScholarships, setTopScholarships] = useState([]);
    const [loading, setLoading] = useState(true);

    const axiosInstance = useAxios();

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                const response = await axiosInstance.get("/scholarships"); 
                setTopScholarships(response.data);
            } catch (err) {
                console.error("Failed to fetch scholarships:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchScholarships();
    }, [axiosInstance]);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">

            {/* HERO */}
            <div className="bg-indigo-600 text-white py-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl font-bold">
                        Find the Best Scholarships for Your Future
                    </h1>
                    <p className="text-lg mt-4 opacity-90">
                        Search, apply, and succeed — ScholarStream connects you with real opportunities.
                    </p>

                    <Link to='/search'>
                        <button
                            className="btn mt-6 px-6 py-3 bg-white text-indigo-700 rounded-lg font-semibold shadow"
                        >
                            Search Scholarships
                        </button>
                    </Link>
                </div>
            </div>

            {/* TOP SCHOLARSHIPS */}
            <div className="max-w-5xl mx-auto px-6 mt-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Top Scholarships</h2>
                    <Link to="/all-scholarships" className="text-indigo-600 hover:underline">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {loading &&
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-md" />
                        ))
                    }

                    {!loading &&
                        topScholarships.map((s) => (
                            <div key={s._id} className="p-4 bg-white rounded-lg shadow border">
                                <h3 className="font-semibold text-lg">{s.scholarshipName}</h3>
                                <p className="text-sm text-gray-600">{s.universityName}</p>

                                <div className="mt-3 text-sm">
                                    <p>Fee: {s.applicationFees ? `$${s.applicationFees}` : "Free"}</p>
                                    <p>
                                        Deadline:{" "}
                                        {s.applicationDeadline ? new Date(s.applicationDeadline).toLocaleDateString() : "—"}
                                    </p>
                                </div>

                                <div className="mt-4 flex justify-between items-center">
                                    <Link
                                        to={`/scholarships/${s._id}`}
                                        className="text-indigo-600 hover:underline"
                                    >
                                        View Details
                                    </Link>
                                    <button
                                        className="px-3 py-1 bg-indigo-600 text-white rounded"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* SUCCESS STORIES */}
            <div className="max-w-5xl mx-auto px-6 mt-12">
                <h2 className="text-2xl font-semibold">Success Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

                    <div className="p-4 bg-indigo-50 border rounded">
                        <p>“This scholarship changed my life.”</p>
                        <p className="mt-2 font-semibold">— Ayesha</p>
                    </div>

                    <div className="p-4 bg-green-50 border rounded">
                        <p>“I studied abroad because of ScholarStream.”</p>
                        <p className="mt-2 font-semibold">— Rafi</p>
                    </div>

                    <div className="p-4 bg-yellow-50 border rounded">
                        <p>“Very easy and clear application system.”</p>
                        <p className="mt-2 font-semibold">— Shathi</p>
                    </div>

                </div>
            </div>

            {/* FAQ */}
            <div className="max-w-5xl mx-auto px-6 mt-12 pb-16">
                <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>

                <div className="mt-4 space-y-4">

                    <details className="bg-white shadow p-4 rounded">
                        <summary className="cursor-pointer font-semibold">How do I apply?</summary>
                        <p className="mt-2 text-gray-700">
                            Open a scholarship page and click “Apply”. Follow instructions from the organization.
                        </p>
                    </details>

                    <details className="bg-white shadow p-4 rounded">
                        <summary className="cursor-pointer font-semibold">
                            Who can post scholarships?
                        </summary>
                        <p className="mt-2 text-gray-700">
                            Universities and verified organizations can post their opportunities.
                        </p>
                    </details>

                    <details className="bg-white shadow p-4 rounded">
                        <summary className="cursor-pointer font-semibold">
                            Is there an application fee?
                        </summary>
                        <p className="mt-2 text-gray-700">
                            Most scholarships are free. Some may include small processing fees.
                        </p>
                    </details>

                </div>
            </div>
        </div>
    );

};

export default Home;