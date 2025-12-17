import React, { useEffect, useRef, useState } from 'react';
import ScholarshipCard from '../../components/Cards/ScholarshipCard';
import SearchBar from '../../components/SearchBar';
import useAxios from "../../hooks/useAxios";
import { useSearchParams } from 'react-router';
import Loader from '../../components/Loader';

const AllScholarships = () => {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [degree, setDegree] = useState("");
    const [category, setCategory] = useState("");
    const [country, setCountry] = useState("");
    const [sort, setSort] = useState("scholarshipPostDate");

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
                    params: { search, degree, category, country, sort }
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
    }, [axiosInstance, search, degree, category, country, sort]);

    {
        loading &&
            <Loader />
    }

    return (
        <div className="min-h-screen text-gray-900 px-4 md:px-10 lg:px-16 py-10">

            <div className="mb-10">
                <h1 className="text-3xl font-bold mb-6 text-center">All Scholarships</h1>

                <div className='sm:flex space-y-2 justify-between'>
                    <SearchBar ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)} />
                    <select onChange={(e) => setSort(e.target.value)}>
                        <option value="scholarshipPostDate">Newest First</option>
                        <option value="applicationDeadline">Deadline</option>
                        <option value="applicationFees">Fees (high to low)</option>
                    </select>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-hidden">
                    <select onChange={(e) => setDegree(e.target.value)} className="select select-bordered">
                        <option value="">All Degrees</option>
                        <option>Bachelors</option>
                        <option>Masters</option>
                        <option>PhD</option>
                    </select>

                    <select onChange={(e) => setCountry(e.target.value)} className="select select-bordered">
                        <option value="">All Countries</option>
                        <option>USA</option>
                        <option>UK</option>
                        <option>Japan</option>
                    </select>

                    <select onChange={(e) => setCategory(e.target.value)} className="select select-bordered">
                        <option value="">All Categories</option>
                        <option>Full Fund</option>
                        <option>Partial Fund</option>
                        <option>Self Fund</option>
                    </select>
                </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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