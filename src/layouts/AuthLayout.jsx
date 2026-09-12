import React from 'react';
import { Outlet } from 'react-router';
import { FaGraduationCap, FaGlobeAmericas, FaCheckCircle } from 'react-icons/fa';

const AuthLayout = () => {
    return (
        <div className="md:grid grid-cols-2 xl:grid-cols-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
                .font-display { font-family: 'Fraunces', serif; }
            `}</style>

            <div className="relative min-h-screen w-full bg-[#0F1B3C] mx-auto xl:col-span-2 justify-center items-center hidden md:flex overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                ></div>

                <div className="relative z-10 text-white space-y-10 flex-col justify-center items-center hidden sm:flex px-10 max-w-xl">
                    <div className="text-center">
                        <h1
                            className="font-display text-4xl xl:text-5xl font-semibold leading-tight"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            Your next scholarship starts here
                        </h1>
                        <p className="text-slate-300 text-lg mt-4">
                            Track applications, save deadlines, and hear back faster.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 w-full">
                        {[
                            { val: "12K+", label: "Scholarships", icon: <FaGraduationCap /> },
                            { val: "450+", label: "Universities", icon: <FaGlobeAmericas /> },
                            { val: "94%", label: "Success rate", icon: <FaCheckCircle /> },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-[#C9A227] text-lg flex justify-center mb-2">{stat.icon}</div>
                                <div className="font-display text-2xl font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>{stat.val}</div>
                                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6 w-full">
                        <p className="text-slate-200 leading-relaxed">
                            "SwiftLaunch made everything simple — from finding the right opportunity to
                            understanding the requirements. This scholarship genuinely changed my life."
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#E8C766]/30"></div>
                            <span className="text-sm font-medium text-white">Ayesha — MIT Scholar</span>
                        </div>
                    </div>
                </div>
            </div>

            <Outlet />
        </div>
    );
};

export default AuthLayout;
