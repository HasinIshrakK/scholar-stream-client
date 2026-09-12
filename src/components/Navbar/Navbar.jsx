import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext';
import { FaBars, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const NAV_LINK_CLASS = ({ isActive }) =>
    `mr-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
            ? 'text-[#0F1B3C] bg-[#0F1B3C]/5'
            : 'text-slate-600 hover:text-[#0F1B3C] hover:bg-slate-50'
    }`;

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    const navLinks = (
        <>
            <li>
                <NavLink to='/' className={NAV_LINK_CLASS} onClick={closeMenu} end>
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink to='/all-scholarships' className={NAV_LINK_CLASS} onClick={closeMenu}>
                    All Scholarships
                </NavLink>
            </li>
            {user && (
                <li>
                    <NavLink to='/dashboard' className={NAV_LINK_CLASS} onClick={closeMenu}>
                        Dashboard
                    </NavLink>
                </li>
            )}
        </>
    );

    return (
        <div
            className="navbar bg-white border-b border-slate-200 sticky top-0 z-50 px-4 md:px-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <div className="navbar-start">
                <div className="dropdown">
                    <div
                        tabIndex={0}
                        role="button"
                        aria-label="Open menu"
                        className="btn btn-ghost lg:hidden text-slate-600"
                    >
                        <FaBars className="h-4 w-4" />
                    </div>
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-white rounded-xl z-10 mt-3 w-56 p-2 shadow-lg border border-slate-100"
                    >
                        {navLinks}
                    </ul>
                </div>
                <Link to='/' className="flex items-center gap-2 pl-1">
                    <span
                        className="text-xl font-semibold text-[#0F1B3C]"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        ScholarStream
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] mb-2"></span>
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-1">
                    {navLinks}
                </ul>
            </div>

            <div className="navbar-end gap-2">
                {user ? (
                    <div className="dropdown dropdown-hover dropdown-end">
                        <div tabIndex={0} role="button" className="m-1">
                            <div
                                className="tooltip tooltip-left"
                                data-tip={user.displayName || 'Your account'}
                            >
                                <img
                                    className="h-9 w-9 rounded-full object-cover border border-slate-200"
                                    src={user.photoURL || '/user.png'}
                                    alt={user.displayName || 'User'}
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={-1}
                            className="dropdown-content menu bg-white rounded-xl z-10 w-56 p-2 shadow-lg border border-slate-100"
                        >
                            <li className="px-3 py-2 mb-1 border-b border-slate-100">
                                <p className="text-sm font-semibold text-[#0F1B3C] truncate">
                                    {user.displayName || 'Signed in'}
                                </p>
                                {user.email && (
                                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                )}
                            </li>
                            <li>
                                <Link
                                    to='/dashboard'
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#0F1B3C]"
                                >
                                    <FaTachometerAlt className="text-xs" /> Dashboard
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left text-slate-600 hover:bg-slate-50 hover:text-[#0F1B3C]"
                                >
                                    <FaSignOutAlt className="text-xs" /> Sign out
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <>
                        <Link
                            to='/auth/login'
                            className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#0F1B3C] text-white hover:bg-[#16234F] transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            to='/auth/register'
                            className="hidden sm:flex px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 text-[#0F1B3C] hover:border-[#C9A227] transition-colors"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
