import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext';
import { FaBars, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { FiSidebar } from 'react-icons/fi';

const NAV_LINK_CLASS =
    "block mr-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:text-[#0F1B3C] hover:bg-slate-50 transition-colors";

const DashboardNavbar = ({ drawerId = 'my-drawer-4' }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const links = (
        <>
            <li><Link to='/' className={NAV_LINK_CLASS}>Home</Link></li>
            <li><Link to='/all-scholarships' className={NAV_LINK_CLASS}>All Scholarships</Link></li>
        </>
    );

    return (
        <div className="navbar bg-[#0F1B3C] px-2 md:px-6 w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="navbar-start gap-1">
                <label
                    htmlFor={drawerId}
                    aria-label="Open sidebar"
                    className="btn btn-square btn-ghost text-white lg:hidden"
                >
                    <FiSidebar className="text-xl" />
                </label>

                <div className="dropdown">
                    <div
                        tabIndex={0}
                        role="button"
                        aria-label="Open menu"
                        className="btn btn-ghost lg:hidden text-white"
                    >
                        <FaBars className="h-4 w-4" />
                    </div>
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-white rounded-xl z-20 mt-3 w-56 p-2 shadow-lg border border-slate-100"
                    >
                        {links}
                    </ul>
                </div>
                <Link to='/dashboard' className="pl-1">
                    <span
                        className="text-lg font-semibold text-white"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        Dashboard
                    </span>
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-1">
                    {links}
                </ul>
            </div>

            <div className="navbar-end gap-2">
                <div className="dropdown dropdown-end dropdown-hover">
                    <div tabIndex={0} role="button" className="m-1">
                        <div className="tooltip tooltip-left" data-tip={user?.displayName || 'Account'}>
                            <img
                                className="h-9 w-9 rounded-full object-cover border border-white/20"
                                src={user?.photoURL || '/user.png'}
                                alt={user?.displayName || 'User'}
                            />
                        </div>
                    </div>
                    <ul
                        tabIndex={-1}
                        className="dropdown-content menu bg-white rounded-xl z-20 w-56 p-2 shadow-lg border border-slate-100"
                    >
                        <li className="px-3 py-2 mb-1 border-b border-slate-100">
                            <p className="text-sm font-semibold text-[#0F1B3C] truncate">
                                {user?.displayName || 'Signed in'}
                            </p>
                            {user?.email && (
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            )}
                        </li>
                        <li>
                            <Link
                                to='/'
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#0F1B3C]"
                            >
                                <FaHome className="text-xs" /> Back to site
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left text-slate-600 hover:bg-slate-50 hover:text-[#0F1B3C]"
                            >
                                <FaSignOutAlt className="text-xs" /> Sign out
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardNavbar;