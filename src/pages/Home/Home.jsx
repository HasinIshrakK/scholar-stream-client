import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import './home.css';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { FaGraduationCap, FaGlobeAmericas, FaAward, FaSearch, FaFileAlt, FaCheckCircle } from 'react-icons/fa';

const Home = () => {
    const navigate = useNavigate();
    const [topScholarships, setTopScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosInstance = useAxios();

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                const response = await axiosInstance.get("/scholarships");
                // Sort by rank and take top 6
                const sorted = response.data.sort((a, b) => a.universityWorldRank - b.universityWorldRank);
                setTopScholarships(sorted.slice(0, 6));
            } catch (err) {
                console.error("Failed to fetch scholarships:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchScholarships();
    }, [axiosInstance]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <div className="relative bg-indigo-900 overflow-hidden">
                {/* Decorative Blobs */}
                <div className="absolute top-0 -left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium mb-4 border border-indigo-500/30">
                                🚀 New: 50+ Ivy League Scholarships Added
                            </span>
                            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight">
                                Your Future <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-emerald-300">Unlocks</span> Here.
                            </h1>
                            <p className="text-xl text-indigo-100 mt-6 max-w-lg opacity-80">
                                SwiftLaunch is the world's most intuitive scholarship engine. Apply to top-tier universities with zero friction.
                            </p>
                            <div className="mt-10 flex flex-wrap gap-4">
                                <button
                                    onClick={() => navigate('/all-scholarships?focus=true')}
                                    className="px-8 py-4 bg-white text-indigo-900 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform"
                                >
                                    Explore Scholarships
                                </button>
                                <button className="px-8 py-4 bg-indigo-800/50 text-white border border-indigo-400/30 rounded-xl font-bold backdrop-blur-sm hover:bg-indigo-800/80 transition-all">
                                    Watch How it Works
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            className="hidden lg:block relative"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                                <img src="https://illustrations.popsy.co/white/student-going-to-school.svg" alt="Education" className="w-full h-auto" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* --- STATS SECTION --- */}
            <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Active Scholarships", val: "12K+", icon: <FaGraduationCap /> },
                        { label: "Universities", val: "450+", icon: <FaGlobeAmericas /> },
                        { label: "Total Funding", val: "$85M", icon: <FaAward /> },
                        { label: "Success Rate", val: "94%", icon: <FaCheckCircle /> },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 text-center">
                            <div className="text-indigo-600 text-2xl flex justify-center mb-2">{stat.icon}</div>
                            <div className="text-3xl font-bold text-slate-800">{stat.val}</div>
                            <div className="text-sm text-slate-500">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- TOP SCHOLARSHIPS --- */}
            <div className="max-w-7xl mx-auto px-6 mt-24">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Top Opportunities</h2>
                        <p className="text-slate-500 mt-2">Handpicked scholarships from world-renowned institutions.</p>
                    </div>
                    <Link to="/all-scholarships" className="hidden sm:block group text-indigo-600 font-semibold">
                        View All <span className="group-hover:pl-2 transition-all">→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ?
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
                        )) :
                        topScholarships.map((s) => (
                            <motion.div
                                key={s._id}
                                whileHover={{ y: -10 }}
                                className="group relative p-6 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="absolute top-4 right-4 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                                    Rank #{s.universityWorldRank}
                                </div>
                                <h3 className="font-bold text-xl mb-1 group-hover:text-indigo-600 transition-colors">{s.scholarshipName}</h3>
                                <p className="text-slate-500 flex items-center gap-2 mb-6">
                                    <FaGlobeAmericas className="text-xs" /> {s.universityName}
                                </p>

                                <div className="space-y-2 py-4 border-t border-slate-50">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Application Fee</span>
                                        <span className="font-semibold">{s.applicationFees ? `$${s.applicationFees}` : "Free"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Deadline</span>
                                        <span className="font-semibold">{new Date(s.applicationDeadline).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <Link to={`/scholarships/${s._id}`} className="block w-full text-center mt-4 py-3 bg-slate-900 text-white rounded-xl font-medium group-hover:bg-indigo-600 transition-colors">
                                    View Details
                                </Link>
                            </motion.div>
                        ))
                    }
                </div>
            </div>

            {/* --- HOW IT WORKS SECTION --- */}
            <div className="bg-slate-900 mt-32 py-24 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold">Launch Your Journey in 3 Steps</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { title: "Find", desc: "Use our smart filters to find the perfect match.", icon: <FaSearch /> },
                            { title: "Prepare", desc: "Organize your documents with our checklist.", icon: <FaFileAlt /> },
                            { title: "Apply", desc: "Submit directly through our secure portal.", icon: <FaCheckCircle /> },
                        ].map((step, i) => (
                            <div key={i} className="relative text-center group">
                                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 rotate-3 group-hover:rotate-12 transition-transform">
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                                {i < 2 && <div className="hidden lg:block absolute top-8 -right-4 w-1/2 border-t-2 border-dashed border-slate-700"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- SUCCESS STORIES --- */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-16">Stories from the Community</h2>
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={'auto'}
                        coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5, slideShadows: false }}
                        autoplay={{ delay: 3000 }}
                        pagination={{ clickable: true }}
                        modules={[EffectCoverflow, Autoplay, Pagination]}
                        className="pb-12"
                    >
                        <SwiperSlide className="max-w-md">
                            <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100 shadow-sm italic text-lg leading-relaxed text-indigo-900">
                                “ScholarStream made everything simple — from finding the right opportunity to understand the requirements. This scholarship genuinely changed my life.”
                                <div className="mt-6 not-italic font-bold flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-200 rounded-full"></div>
                                    <span>Ayesha - MIT Scholar</span>
                                </div>
                            </div>
                        </SwiperSlide><SwiperSlide className="max-w-md">
                            <div className="p-8 bg-green-50 rounded-3xl border border-green-100 shadow-sm italic text-lg leading-relaxed text-green-900">
                                “What I loved most about ScholarStream was how easy everything felt.
                                No confusing steps, no hidden information — just clear guidance from start to finish.
                                I applied confidently, knowing exactly what was required.”
                                <div className="mt-6 not-italic font-bold flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-200 rounded-full"></div>
                                    <span>Shathi - MIT Scholar</span>
                                </div>
                            </div>
                        </SwiperSlide><SwiperSlide className="max-w-md">
                            <div className="p-8 bg-yellow-50 rounded-3xl border border-yellow-100 shadow-sm italic text-lg leading-relaxed text-yellow-900">
                                “Through ScholarStream, I discovered scholarships that actually matched my background and qualifications.
                                The application process was transparent, and stress-free.”
                                <div className="mt-6 not-italic font-bold flex items-center gap-4">
                                    <div className="w-12 h-12 bg-yellow-200 rounded-full"></div>
                                    <span>Amena - Harvard Student</span>
                                </div>
                            </div>
                        </SwiperSlide><SwiperSlide className="max-w-md">
                            <div className="p-8 bg-red-50 rounded-3xl border border-red-100 shadow-sm italic text-lg leading-relaxed text-red-900">
                                “Before finding this scholarship, I almost gave up on studying abroad.
                                ScholarStream made everything simple — from finding the right opportunity to understanding the requirements.
                                <div className="mt-6 not-italic font-bold flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-200 rounded-full"></div>
                                    <span>Rafi - MIT Student</span>
                                </div>
                            </div>
                        </SwiperSlide>
                        {/* Add more SwiperSlides as needed */}
                    </Swiper>
                </div>
            </div>

            {/* --- FAQ SECTION --- */}
            <div className="max-w-4xl mx-auto px-6 mb-32">
                <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
                <div className="space-y-4">
                    {[
                        { q: "How do I apply?", a: "Find your scholarship, click 'Apply', and follow our step-by-step guided portal." },
                        { q: "Who can post scholarships?", a: "Verified universities and educational foundations only." },
                        { q: "Are there hidden fees?", a: "No. SwiftLaunch is transparent about all application fees upfront." }
                    ].map((item, i) => (
                        <details key={i} className="group border border-slate-200 rounded-2xl overflow-hidden transition-all">
                            <summary className="list-none flex justify-between items-center p-6 cursor-pointer font-semibold bg-white hover:bg-slate-50">
                                {item.q}
                                <span className="group-open:rotate-180 transition-transform">↓</span>
                            </summary>
                            <div className="p-6 pt-0 bg-white text-slate-600">
                                {item.a}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;