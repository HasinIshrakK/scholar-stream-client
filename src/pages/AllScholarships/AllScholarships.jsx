import React, { useEffect, useState } from 'react';
import ScholarshipCard from '../../components/Cards/ScholarshipCard';
import SearchBar from '../../components/SearchBar';

const dummyScholarships = [
    {
        _id: 1,
        universityImage: "https://i.ibb.co/ZN8psJX/university1.jpg",
        universityName: "Oxford University",
        category: "Undergraduate",
        location: "UK",
        fee: 500,
    },
    {
        _id: 2,
        universityImage: "https://i.ibb.co/17rLhSw/university2.jpg",
        universityName: "Harvard University",
        category: "Masters",
        location: "USA",
        fee: 0,
    },
    {
        _id: 3,
        universityImage: "https://i.ibb.co/bzbRKP5/university3.jpg",
        universityName: "University of Tokyo",
        category: "PhD",
        location: "Japan",
        fee: 300,
    },
];

const AllScholarships = () => {

    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setScholarships(dummyScholarships);
            setLoading(false);
        }, 400);
    }, []);

    return (
        <div className="min-h-screen text-gray-900 px-4 md:px-10 lg:px-16 py-10">

            <div className="mb-10">
                <h1 className="text-3xl font-bold mb-6 text-center">All Scholarships</h1>

                <SearchBar />

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
                    Array.from({ length: dummyScholarships.length }).map((_, i) => (
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