import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import DashboardNavbar from '../components/Navbar/DashboardNavbar';
import Footer from '../components/Footer/Footer';
import { MdOutlineReviews, MdReviews } from 'react-icons/md';
import { TiDocumentText } from 'react-icons/ti';
import { FaRegUser } from 'react-icons/fa';
import { FiHome } from 'react-icons/fi';
import { IoDocumentLock } from 'react-icons/io5';
import { GrDocumentConfig } from 'react-icons/gr';
import { HiOutlineDocumentPlus } from 'react-icons/hi2';
import { RiUserSettingsLine } from 'react-icons/ri';
import Loader from '../components/Loader';
import useRole from '../hooks/useRole';
import useAuth from '../hooks/useAuth';

const DRAWER_ID = 'my-drawer-4';

const SIDEBAR_LINK_CLASS = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
        ? 'bg-white/10 text-white'
        : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`;

const SidebarLink = ({ to, icon, label }) => (
    <li>
        <NavLink to={to} className={SIDEBAR_LINK_CLASS} end={to === '/dashboard'}>
            <span className="text-lg shrink-0">{icon}</span>
            <span>{label}</span>
        </NavLink>
    </li>
);

const SidebarSection = ({ title, children }) => (
    <div className="mb-4">
        {title && (
            <p className="px-4 mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {title}
            </p>
        )}
        <ul className="space-y-0.5">{children}</ul>
    </div>
);

const DashboardLayout = () => {
    const { loading } = useAuth();
    const { role, roleLoading } = useRole();

    if (loading || roleLoading) {
        return <Loader />;
    }

    return (
        <div className="drawer lg:drawer-open">
            <input id={DRAWER_ID} type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col">
                <div className="sticky top-0 z-20">
                    <DashboardNavbar drawerId={DRAWER_ID} />
                </div>

                <div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A] flex-1">
                    <Outlet />
                </div>
                <Footer />
            </div>

            <div className="drawer-side z-30">
                <label htmlFor={DRAWER_ID} aria-label="Close sidebar" className="drawer-overlay"></label>
                <div className="flex min-h-full w-64 flex-col bg-[#0F1B3C] py-6">
                    <div className="px-4 mb-6 hidden lg:block">
                        <Link to="/">
                            <span
                                className="text-lg font-semibold text-white"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                ScholarStream
                            </span>
                        </Link>
                    </div>

                    <nav className="flex-1 px-2">
                        <SidebarSection>
                            <SidebarLink to='/dashboard' icon={<FiHome />} label="Homepage" />
                            <SidebarLink to='/dashboard/my-profile' icon={<FaRegUser />} label="My Profile" />
                            <SidebarLink to='/dashboard/my-applications' icon={<TiDocumentText />} label="My Applications" />
                            <SidebarLink to='/dashboard/my-reviews' icon={<MdOutlineReviews />} label="My Reviews" />
                        </SidebarSection>

                        {role === 'moderator' && (
                            <SidebarSection title="Moderator">
                                <SidebarLink to='/dashboard/all-applications' icon={<IoDocumentLock />} label="All Applications" />
                                <SidebarLink to='/dashboard/all-reviews' icon={<MdReviews />} label="All Reviews" />
                            </SidebarSection>
                        )}

                        {role === 'admin' && (
                            <SidebarSection title="Admin">
                                <SidebarLink to='/dashboard/add-scholarship' icon={<HiOutlineDocumentPlus />} label="Add Scholarship" />
                                <SidebarLink to='/dashboard/manage-scholarships' icon={<GrDocumentConfig />} label="Manage Scholarships" />
                                <SidebarLink to='/dashboard/manage-users' icon={<RiUserSettingsLine />} label="Manage Users" />
                            </SidebarSection>
                        )}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;