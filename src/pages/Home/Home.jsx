import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxios from "../../hooks/useAxios"
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './home.css';

// import required modules
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';


const Home = () => {

    const [topScholarships, setTopScholarships] = useState([]);
    const [loading, setLoading] = useState(true);

    const axiosInstance = useAxios();

    const s = topScholarships.sort((a, b) => a.universityWorldRank - b.universityWorldRank);

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
                <motion.div className="max-w-5xl mx-auto text-center"
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
                    <motion.h1 className="text-4xl font-bold"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        Find the Best Scholarships for Your Future
                    </motion.h1>

                    <motion.p className="text-lg mt-4 opacity-90"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        Search, apply, and succeed — ScholarStream connects you with real opportunities.
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Link to="/">
                            <button className="btn mt-6 px-6 py-3 bg-white text-indigo-700 rounded-lg font-semibold shadow">
                                Search Scholarships
                            </button>
                        </Link>
                    </motion.div>
                </motion.div>
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
                        s.slice(0, 6).map((s) => (
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

                                    <button className="px-3 py-1 bg-indigo-600 text-white rounded">
                                        <Link to={`/scholarships/${s._id}`}>
                                            View Details
                                        </Link>
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* SUCCESS STORIES */}
            <div className="max-w-5xl mx-auto px-6 mt-12">
                <h2 className="text-2xl font-semibold mb-6">Success Stories</h2>

                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: false,
                    }}
                    autoplay={{
                        delay: 2000,
                    }}
                    loopedSlides={6}

                    pagination={true}
                    modules={[EffectCoverflow, Autoplay, Pagination]}
                    className="mySwiper"
                >
                    <SwiperSlide className="max-w-sm">
                        <div className="p-4 mx-6 sm:mx-0 bg-indigo-50 border rounded">
                            <p>“Before finding this scholarship, I almost gave up on studying abroad.
                                The process felt confusing and overwhelming.
                                ScholarStream made everything simple — from finding the right opportunity to understanding the requirements.
                                This scholarship genuinely changed my life and opened doors I never thought possible.”</p>
                            <p className="mt-2 font-semibold">— Ayesha</p>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide className="max-w-sm">
                        <div className="p-4 mx-6 sm:mx-0 bg-green-50 border rounded">
                            <p>“I always thought studying abroad was only for people with connections or lots of money.
                                Through ScholarStream, I discovered scholarships that actually matched my background and qualifications.
                                The application process was clear, transparent, and stress-free.
                                Today, I’m studying overseas because of this platform.”</p>
                            <p className="mt-2 font-semibold">— Rafi</p>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide className="max-w-sm">
                        <div className="p-4 mx-6 sm:mx-0 bg-yellow-50 border rounded">
                            <p>“What I loved most about ScholarStream was how easy everything felt.
                                No confusing steps, no hidden information — just clear guidance from start to finish.
                                I applied confidently, knowing exactly what was required.
                                It’s one of the few platforms I truly trust for scholarship applications.””</p>
                            <p className="mt-2 font-semibold">— Shathi</p>
                        </div>
                    </SwiperSlide>
                </Swiper>
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
        </div >
    );

};

export default Home;