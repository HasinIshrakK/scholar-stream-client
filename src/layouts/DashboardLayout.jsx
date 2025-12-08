import React from 'react';
import { NavLink, Outlet } from 'react-router';
import DashboardNavbar from '../components/Navbar/DashboardNavbar';
import Footer from '../components/Footer/Footer';
import { MdOutlineReviews } from 'react-icons/md';
import { TiDocumentText } from 'react-icons/ti';
import { FaRegUser } from 'react-icons/fa';
import { FiHome } from 'react-icons/fi';

const DashboardLayout = () => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Navbar */}
                <nav className="navbar w-full bg-base-300 shadow-sm sticky top-0 z-10">
                    <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        {/* Sidebar toggle icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                    </label>
                    <DashboardNavbar />
                </nav>
                {/* Page content here */}
                <div className="min-h-screen bg-gray-100 text-gray-900">
                    <Outlet />
                </div>
                <Footer></Footer>
            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                    {/* Sidebar content here */}
                    <ul className="menu w-full grow lg:pt-10">
                        {/* List item */}
                        <li>
                            <NavLink to='/dashboard'>
                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex space-x-2" data-tip="Homepage">
                                    {/* Home icon */}
                                    <div className='text-2xl'>
                                        <FiHome />
                                    </div>
                                    <span className="is-drawer-close:hidden">Homepage</span>
                                </button>
                            </NavLink>
                        </li>

                        {/* List item */}
                        <li>
                            <NavLink to='/dashboard/my-profile'>
                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex space-x-2" data-tip="My Profile">
                                    {/* User icon */}
                                    <div className='text-2xl'>
                                        <FaRegUser />
                                    </div>
                                    <span className="is-drawer-close:hidden">My Profile</span>
                                </button>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/dashboard/my-applications'>
                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex space-x-2" data-tip="My Applications">
                                    {/* Applications icon */}
                                    <div className='text-2xl'>
                                        <TiDocumentText />
                                    </div>
                                    <span className="is-drawer-close:hidden">My Applications</span>
                                </button>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/dashboard/my-reviews'>
                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex space-x-2" data-tip="My Reviews">
                                    {/* Reviews icon */}
                                    <div className='text-2xl'>
                                        <MdOutlineReviews />
                                    </div>
                                    <span className="is-drawer-close:hidden">My Reviews</span>
                                </button>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;