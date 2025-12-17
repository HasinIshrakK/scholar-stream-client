import React, { useEffect, useRef, useState } from 'react';
import ScholarshipCard from '../../components/Cards/ScholarshipCard';
import SearchBar from '../../components/SearchBar';
import useAxios from "../../hooks/useAxios";
import { useSearchParams } from 'react-router';

const AllScholarships = () => {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const axiosInstance = useAxios();

    const [params] = useSearchParams();
    const searchRef = useRef();
    useEffect(
        () => {
            if (params.get("focus") === "true") {
                searchRef.current?.focus()
            }
        }, []
    )

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                const res = await axiosInstance.get(`/scholarships`, {
                    params: { search }
                });
                setScholarships(res.data);
            } catch (err) {
                console.error("Failed to fetch scholarships:", err);
                setScholarships([]);
            } finally {
                setLoading(false);
            }
        };

        fetchScholarships();
    }, [axiosInstance, search]);

    return (
        <div className="min-h-screen text-gray-900 px-4 md:px-10 lg:px-16 py-10">

            <div className="mb-10">
                <h1 className="text-3xl font-bold mb-6 text-center">All Scholarships</h1>

                <SearchBar ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)} />

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-hidden">
                    <select className="border p-3 rounded-lg w-56 sm:w-full">
                        <option value="">Filter by Category</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Masters">Masters</option>
                        <option value="PhD">PhD</option>
                    </select>

                    <select className="border p-3 rounded-lg w-56 sm:w-full">
                        <option value="">Filter by Location</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Japan">Japan</option>
                    </select>

                    <select className="border p-3 rounded-lg w-56 sm:w-full">
                        <option value="">Filter by Subject</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Business">Business</option>
                        <option value="Science">Science</option>
                    </select>
                </div>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading &&
                    Array.from({ length: scholarships.length }).map((_, i) => (
                        <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-md" />
                    ))
                }

                {!loading &&
                    scholarships.map((scholarship) => (
                        <ScholarshipCard key={scholarship._id} scholarship={scholarship} />
                    ))
                }
            </div>
        </div>
    );
};

export default AllScholarships;