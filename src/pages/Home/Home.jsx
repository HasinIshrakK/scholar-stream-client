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
import {
    FaGraduationCap, FaGlobeAmericas, FaAward, FaSearch, FaFileAlt, FaCheckCircle,
    FaUserTie, FaLaptopCode, FaFlask, FaBalanceScale, FaPalette, FaCoins,
    FaShieldAlt, FaHeadset, FaRoute, FaBell, FaArrowRight, FaTimes, FaTools
} from 'react-icons/fa';

// Fields students commonly search scholarships for. Counts are illustrative
// and should be wired up to real aggregate data once the API supports it.
const FIELDS = [
    { name: "Business & Management", icon: <FaUserTie />, count: "1,240" },
    { name: "Computer Science", icon: <FaLaptopCode />, count: "980" },
    { name: "Engineering", icon: <FaFlask />, count: "1,510" },
    { name: "Law & Public Policy", icon: <FaBalanceScale />, count: "410" },
    { name: "Arts & Humanities", icon: <FaPalette />, count: "670" },
    { name: "Finance & Economics", icon: <FaCoins />, count: "530" },
];

const PARTNER_UNIVERSITIES = [
    "Harvard University", "University of Oxford", "MIT", "Stanford University",
    "University of Toronto", "ETH Zürich", "National University of Singapore",
    "University of Melbourne", "LSE", "University of Tokyo",
];

const BENEFITS = [
    {
        icon: <FaShieldAlt />,
        title: "Every listing is verified",
        desc: "Our team confirms each scholarship directly with the issuing university before it goes live, so you never chase a dead link.",
    },
    {
        icon: <FaRoute />,
        title: "One dashboard, every stage",
        desc: "Track deadlines, upload documents, and follow application status across every school you've applied to, in one place.",
    },
    {
        icon: <FaHeadset />,
        title: "Advisors who reply",
        desc: "Message a former admissions reviewer when a requirement is unclear — most questions get a real answer within a day.",
    },
    {
        icon: <FaBell />,
        title: "Deadlines come to you",
        desc: "Set your fields of interest once and get notified as new scholarships open, weeks before applications typically close.",
    },
];

const Home = () => {
    const navigate = useNavigate();
    const [topScholarships, setTopScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [showMatchingModal, setShowMatchingModal] = useState(false);
    const axiosInstance = useAxios();

    useEffect(() => {
        if (!showMatchingModal) return;
        const onKeyDown = (e) => {
            if (e.key === "Escape") setShowMatchingModal(false);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [showMatchingModal]);

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                const response = await axiosInstance.get("/scholarships");
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

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email) return;
        setSubscribed(true);
    };

    const scrollToAlerts = () => {
        setShowMatchingModal(false);
        document.getElementById('scholarship-alerts')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return (
        <div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A] overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
                .font-display { font-family: 'Fraunces', serif; }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-track {
                    animation: marquee 32s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .marquee-track { animation: none; }
                }
            `}</style>

            {/* --- HERO SECTION --- */}
            <div className="relative bg-[#0F1B3C]">
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                ></div>

                <div className="max-w-7xl mx-auto px-6 py-24 lg:py-28 relative z-10">
                    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        >
                            <p className="text-[#E8C766] font-medium tracking-wide mb-5">
                                12,000+ funded places across 450 universities
                            </p>
                            <h1 className="font-display text-5xl lg:text-6xl font-semibold text-white leading-[1.1]">
                                Find the scholarship your application actually qualifies for.
                            </h1>
                            <p className="text-lg text-slate-300 mt-6 max-w-lg leading-relaxed">
                                SwiftLaunch matches your grades, field, and country of residence against verified
                                scholarships — so you spend your time writing essays, not searching spreadsheets.
                            </p>
                            <div className="mt-10 flex flex-wrap items-center gap-5">
                                <button
                                    onClick={() => navigate('/all-scholarships?focus=true')}
                                    className="px-8 py-4 bg-[#E8C766] text-[#0F1B3C] rounded-lg font-semibold hover:bg-white transition-colors"
                                >
                                    Explore scholarships
                                </button>
                                <button
                                    onClick={() => setShowMatchingModal(true)}
                                    className="flex items-center gap-2 text-white font-medium border-b border-white/30 pb-1 hover:border-white transition-colors"
                                >
                                    See how matching works <FaArrowRight className="text-sm" />
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            className="hidden lg:block relative"
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.15 }}
                        >
                            <div className="bg-white/[0.04] p-10 rounded-2xl border border-white/10">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-white font-display text-lg">Your match score</span>
                                    <span className="text-[#E8C766] font-display text-3xl font-semibold">92%</span>
                                </div>
                                <div className="space-y-4">
                                    {["Academic profile", "Field alignment", "Country eligibility"].map((row, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm text-slate-300 mb-1.5">
                                                <span>{row}</span>
                                            </div>
                                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#E8C766] rounded-full"
                                                    style={{ width: `${[88, 95, 90][i]}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* --- TRUSTED-BY MARQUEE --- */}
            <div className="bg-white border-b border-slate-100 py-6 overflow-hidden">
                <p className="text-center text-xs uppercase tracking-widest text-slate-400 mb-4">
                    Applicants on SwiftLaunch have gone on to study at
                </p>
                <div className="flex whitespace-nowrap">
                    <div className="flex marquee-track gap-14 pr-14">
                        {[...PARTNER_UNIVERSITIES, ...PARTNER_UNIVERSITIES].map((name, i) => (
                            <span key={i} className="text-slate-400 font-display text-lg shrink-0">
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- STATS SECTION --- */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 rounded-xl overflow-hidden">
                    {[
                        { label: "Active scholarships", val: "12K+", icon: <FaGraduationCap /> },
                        { label: "Partner universities", val: "450+", icon: <FaGlobeAmericas /> },
                        { label: "Funding awarded", val: "$85M", icon: <FaAward /> },
                        { label: "Application success", val: "94%", icon: <FaCheckCircle /> },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 text-center">
                            <div className="text-[#C9A227] text-xl flex justify-center mb-3">{stat.icon}</div>
                            <div className="font-display text-3xl font-semibold text-[#0F1B3C]">{stat.val}</div>
                            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- FIELDS OF STUDY --- */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-10">
                    <h2 className="font-display text-3xl font-semibold text-[#0F1B3C]">Browse by field</h2>
                    <p className="text-slate-500 mt-2">Start from what you study, not a keyword search.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {FIELDS.map((field, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(`/all-scholarships?field=${encodeURIComponent(field.name)}`)}
                            className="text-left p-5 bg-white rounded-xl border border-slate-200 hover:border-[#C9A227] hover:shadow-md transition-all"
                        >
                            <div className="text-[#0F1B3C] text-xl mb-4">{field.icon}</div>
                            <div className="font-semibold text-sm leading-snug">{field.name}</div>
                            <div className="text-xs text-slate-400 mt-1">{field.count} open</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* --- TOP SCHOLARSHIPS --- */}
            <div className="max-w-7xl mx-auto px-6 mt-20">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="font-display text-3xl font-semibold text-[#0F1B3C]">Top opportunities this month</h2>
                        <p className="text-slate-500 mt-2">Ranked by the world standing of the awarding university.</p>
                    </div>
                    <Link to="/all-scholarships" className="hidden sm:flex items-center gap-2 text-[#0F1B3C] font-semibold hover:text-[#C9A227] transition-colors">
                        View all <FaArrowRight className="text-sm" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ?
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-xl" />
                        )) :
                        topScholarships.map((s) => (
                            <div
                                key={s._id}
                                className="group relative p-6 bg-white rounded-xl border border-slate-200 hover:border-[#C9A227] hover:shadow-lg transition-all duration-200"
                            >
                                <div className="absolute top-6 right-6 bg-[#0F1B3C]/5 text-[#0F1B3C] text-xs font-semibold px-2.5 py-1 rounded-full">
                                    Rank #{s.universityWorldRank}
                                </div>
                                <h3 className="font-display font-semibold text-xl mb-1 pr-16">{s.scholarshipName}</h3>
                                <p className="text-slate-500 flex items-center gap-2 mb-6 text-sm">
                                    <FaGlobeAmericas className="text-xs" /> {s.universityName}
                                </p>

                                <div className="space-y-2 py-4 border-t border-slate-100">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Application fee</span>
                                        <span className="font-semibold">{s.applicationFees ? `$${s.applicationFees}` : "Free"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Deadline</span>
                                        <span className="font-semibold">{new Date(s.applicationDeadline).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <Link to={`/scholarships/${s._id}`} className="block w-full text-center mt-4 py-3 bg-[#0F1B3C] text-white rounded-lg font-medium group-hover:bg-[#C9A227] group-hover:text-[#0F1B3C] transition-colors">
                                    View details
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* --- WHY CHOOSE US --- */}
            <div className="max-w-7xl mx-auto px-6 mt-28">
                <div className="mb-12 max-w-xl">
                    <h2 className="font-display text-3xl font-semibold text-[#0F1B3C]">Built for the parts of this process that waste your time</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {BENEFITS.map((b, i) => (
                        <div key={i} className="p-6 bg-white rounded-xl border border-slate-200">
                            <div className="text-[#C9A227] text-2xl mb-5">{b.icon}</div>
                            <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- HOW IT WORKS SECTION --- */}
            <div className="bg-[#0F1B3C] mt-28 py-24 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16 max-w-xl">
                        <h2 className="font-display text-3xl font-semibold">Three steps from search to submission</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { n: "01", title: "Find", desc: "Filter by field, country, and eligibility to see only scholarships you can actually apply for.", icon: <FaSearch /> },
                            { n: "02", title: "Prepare", desc: "Work through a checklist built from the university's own requirements, document by document.", icon: <FaFileAlt /> },
                            { n: "03", title: "Apply", desc: "Submit through our secure portal and track your status without emailing the admissions office.", icon: <FaCheckCircle /> },
                        ].map((step, i) => (
                            <div key={i} className="relative">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="font-display text-[#C9A227] text-lg">{step.n}</span>
                                    <div className="h-px flex-1 bg-white/15"></div>
                                    <span className="text-white/70">{step.icon}</span>
                                </div>
                                <h3 className="font-display text-2xl font-semibold mb-3">{step.title}</h3>
                                <p className="text-slate-300 leading-relaxed text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- SUCCESS STORIES --- */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="font-display text-3xl font-semibold text-center mb-16 text-[#0F1B3C]">Stories from the community</h2>
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={'auto'}
                        coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5, slideShadows: false }}
                        autoplay={{ delay: 3500 }}
                        pagination={{ clickable: true }}
                        modules={[EffectCoverflow, Autoplay, Pagination]}
                        className="pb-12"
                    >
                        <SwiperSlide className="max-w-md">
                            <div className="p-8 bg-[#FAF6EA] rounded-2xl border border-[#E8C766]/30 leading-relaxed text-[#0F1B3C]">
                                <p>"SwiftLaunch made everything simple — from finding the right opportunity to understanding the requirements. This scholarship genuinely changed my life."</p>
                                <div className="mt-6 font-semibold flex items-center gap-4">
                                    <div className="w-11 h-11 bg-[#E8C766]/40 rounded-full"></div>
                                    <span>Ayesha — MIT Scholar</span>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide className="max-w-md">
                            <div className="p-8 bg-[#EEF3F1] rounded-2xl border border-[#1F6F6B]/20 leading-relaxed text-[#0F1B3C]">
                                <p>"What I loved most was how easy everything felt. No confusing steps, no hidden information — just clear guidance from start to finish. I applied confidently, knowing exactly what was required."</p>
                                <div className="mt-6 font-semibold flex items-center gap-4">
                                    <div className="w-11 h-11 bg-[#1F6F6B]/20 rounded-full"></div>
                                    <span>Shathi — MIT Scholar</span>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide className="max-w-md">
                            <div className="p-8 bg-[#F5F0FA] rounded-2xl border border-slate-200 leading-relaxed text-[#0F1B3C]">
                                <p>"I discovered scholarships that actually matched my background and qualifications. The application process was transparent and stress-free from day one."</p>
                                <div className="mt-6 font-semibold flex items-center gap-4">
                                    <div className="w-11 h-11 bg-slate-200 rounded-full"></div>
                                    <span>Amena — Harvard Student</span>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide className="max-w-md">
                            <div className="p-8 bg-[#FBEFEF] rounded-2xl border border-slate-200 leading-relaxed text-[#0F1B3C]">
                                <p>"Before finding this scholarship, I had nearly given up on studying abroad. SwiftLaunch made everything simple, from finding the right opportunity to understanding exactly what it required."</p>
                                <div className="mt-6 font-semibold flex items-center gap-4">
                                    <div className="w-11 h-11 bg-slate-200 rounded-full"></div>
                                    <span>Rafi — MIT Student</span>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>

            {/* --- NEWSLETTER / ALERTS --- */}
            <div id="scholarship-alerts" className="max-w-5xl mx-auto px-6 my-24 scroll-mt-24">
                <div className="bg-[#0F1B3C] rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-md">
                        <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mb-2">Get new scholarships before they fill up</h2>
                        <p className="text-slate-300 text-sm">One email a week, matched to the fields and countries you care about. Unsubscribe any time.</p>
                    </div>
                    {subscribed ? (
                        <div className="flex items-center gap-3 text-[#E8C766] font-medium shrink-0">
                            <FaCheckCircle /> You're on the list — check your inbox.
                        </div>
                    ) : (
                        <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-3 shrink-0">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@email.com"
                                className="w-30 sm:w-36 lg:w-64 md:w-48 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:border-[#E8C766]"
                            />
                            <button
                                type="submit"
                                className="px-3 sm:px-4 lg:px-6 py-3 bg-[#E8C766] text-[#0F1B3C] rounded-lg font-semibold hover:bg-white transition-colors shrink-0"
                            >
                                Notify me
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* --- FAQ SECTION --- */}
            <div className="max-w-4xl mx-auto px-6 mb-28">
                <h2 className="font-display text-3xl font-semibold text-center mb-12 text-[#0F1B3C]">Common questions</h2>
                <div className="space-y-3">
                    {[
                        { q: "How do I apply?", a: "Find your scholarship, click 'Apply', and follow our step-by-step guided portal." },
                        { q: "Who can post scholarships?", a: "Verified universities and educational foundations only — every listing is checked before it goes live." },
                        { q: "Are there hidden fees?", a: "No. SwiftLaunch is transparent about all application fees upfront, and most listings charge none at all." },
                        { q: "Can I apply from any country?", a: "Eligibility is set by each university, not by us. Every listing states exactly which countries and academic levels qualify." },
                    ].map((item, i) => (
                        <details key={i} className="group border border-slate-200 rounded-xl overflow-hidden">
                            <summary className="list-none flex justify-between items-center p-6 cursor-pointer font-semibold bg-white hover:bg-slate-50">
                                {item.q}
                                <span className="text-slate-400 group-open:rotate-180 transition-transform">↓</span>
                            </summary>
                            <div className="p-6 pt-0 bg-white text-slate-600 text-sm leading-relaxed">
                                {item.a}
                            </div>
                        </details>
                    ))}
                </div>
            </div>

            {/* --- MATCHING EXPLAINER MODAL --- */}
            {showMatchingModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="matching-modal-title"
                    onClick={() => setShowMatchingModal(false)}
                >
                    <div className="absolute inset-0 bg-[#0F1B3C]/70 backdrop-blur-sm"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white rounded-2xl max-w-lg w-full p-8 md:p-10"
                    >
                        <button
                            onClick={() => setShowMatchingModal(false)}
                            aria-label="Close"
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                            <FaTimes />
                        </button>

                        <div className="w-11 h-11 rounded-full bg-[#0F1B3C]/5 text-[#0F1B3C] flex items-center justify-center text-lg mb-6">
                            <FaTools />
                        </div>

                        <h3 id="matching-modal-title" className="font-display text-2xl font-semibold text-[#0F1B3C] mb-3">
                            Personalized matching isn't live yet
                        </h3>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            We're building a matching model that will score scholarships against your grades,
                            field, and country of residence, similar to the preview above. It's still in
                            development, so nothing is scored automatically today.
                        </p>
                        <p className="text-slate-600 leading-relaxed mb-8">
                            In the meantime, the fastest way to find something you qualify for is to browse by
                            field or use the filters on the scholarships page — every listing already states its
                            own eligibility rules.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => {
                                    setShowMatchingModal(false);
                                    navigate('/all-scholarships');
                                }}
                                className="flex-1 px-5 py-3 bg-[#0F1B3C] text-white rounded-lg font-semibold hover:bg-[#16234F] transition-colors"
                            >
                                Browse scholarships now
                            </button>
                            <button
                                onClick={scrollToAlerts}
                                className="flex-1 px-5 py-3 border border-slate-200 text-[#0F1B3C] rounded-lg font-semibold hover:border-[#C9A227] transition-colors"
                            >
                                Get notified when it's ready
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Home;
