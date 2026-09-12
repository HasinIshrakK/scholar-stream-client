import React, { useEffect, useRef, useState } from 'react';
import ScholarshipCard from '../../components/Cards/ScholarshipCard';
import SearchBar from '../../components/SearchBar';
import useAxios from "../../hooks/useAxios";
import { useSearchParams } from 'react-router';
import Loader from '../../components/Loader';
import { FaGraduationCap, FaRedo } from 'react-icons/fa';

const SELECT_CLASS =
    "w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 " +
    "focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-colors";

const FIELD_OPTIONS = [
    "Business & Management",
    "Computer Science",
    "Engineering",
    "Law & Public Policy",
    "Arts & Humanities",
    "Finance & Economics",
];

const AllScholarships = () => {
    const [params] = useSearchParams();

    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(params.get("search") || "");
    const [degree, setDegree] = useState("");
    const [category, setCategory] = useState("");
    const [country, setCountry] = useState("");
    const [field, setField] = useState(params.get("field") || "");
    const [sort, setSort] = useState("scholarshipPostDate");

    const axiosInstance = useAxios();
    const searchRef = useRef();

    useEffect(() => {
        if (params.get("focus") === "true") {
            searchRef.current?.focus();
        }
    }, []);

    useEffect(() => {
        const fetchScholarships = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/scholarships`, {
                    params: { search, degree, category, country, field, sort }
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
    }, [axiosInstance, search, degree, category, country, field, sort]);

    const hasActiveFilters = search || degree || category || country || field;

    const clearFilters = () => {
        setSearch("");
        setDegree("");
        setCategory("");
        setCountry("");
        setField("");
        setSort("scholarshipPostDate");
    };

    return (
        <div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16 py-12">

                <div className="mb-10">
                    <h1
                        className="text-3xl md:text-4xl font-semibold text-[#0F1B3C] mb-2"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        All Scholarships
                    </h1>
                    <p className="text-slate-500">
                        {loading ? "Searching..." : `${scholarships.length} scholarship${scholarships.length === 1 ? "" : "s"} match your filters`}
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 mb-10">
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <div className="flex-1">
                            <SearchBar ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className={`${SELECT_CLASS} sm:w-56`}
                        >
                            <option value="scholarshipPostDate">Newest first</option>
                            <option value="applicationDeadline">Deadline</option>
                            <option value="applicationFees">Fees (high to low)</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <select value={degree} onChange={(e) => setDegree(e.target.value)} className={SELECT_CLASS}>
                            <option value="">All degrees</option>
                            <option>Bachelors</option>
                            <option>Masters</option>
                            <option>PhD</option>
                        </select>

                        <select value={field} onChange={(e) => setField(e.target.value)} className={SELECT_CLASS}>
                            <option value="">All fields</option>
                            {FIELD_OPTIONS.map((f) => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>

                        <select value={country} onChange={(e) => setCountry(e.target.value)} className={SELECT_CLASS}>
                            <option value="">All countries</option>
                            <option>USA</option>
                            <option>UK</option>
                            <option>Japan</option>
                        </select>

                        <select value={category} onChange={(e) => setCategory(e.target.value)} className={SELECT_CLASS}>
                            <option value="">All categories</option>
                            <option>Full Fund</option>
                            <option>Partial Fund</option>
                            <option>Self Fund</option>
                        </select>
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0F1B3C] mt-4 transition-colors"
                        >
                            <FaRedo className="text-xs" /> Clear all filters
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="py-24">
                        <Loader />
                    </div>
                ) : scholarships.length === 0 ? (
                    <div className="text-center py-24 bg-white border border-dashed border-slate-200 rounded-2xl">
                        <div className="w-12 h-12 rounded-full bg-[#0F1B3C]/5 text-[#0F1B3C] flex items-center justify-center mx-auto mb-4 text-lg">
                            <FaGraduationCap />
                        </div>
                        <h3 className="font-semibold text-lg text-[#0F1B3C] mb-1">No scholarships match your filters</h3>
                        <p className="text-slate-500 text-sm mb-6">Try widening your search or clearing a filter or two.</p>
                        <button
                            onClick={clearFilters}
                            className="px-5 py-2.5 bg-[#0F1B3C] text-white rounded-lg font-medium text-sm hover:bg-[#16234F] transition-colors"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {scholarships.map((scholarship) => (
                            <ScholarshipCard key={scholarship._id} scholarship={scholarship} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllScholarships;
