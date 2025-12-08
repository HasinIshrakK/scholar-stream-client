import React, { useContext } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext';

const l = <>
    <Link to='/'>
        <li className='mr-2'>Home</li>
    </Link>
    <Link to='/all-scholarships'>
        <li className='mr-2'>All Scholarships</li>
    </Link>
</>

const DashboardNavbar = () => {

    const { user, logout } = useContext(AuthContext);

    return (
        <div className="navbar bg-base-300">
            <div className="navbar-start">
                <Link to='/dashboard'>
                    <p className="btn btn-ghost text-xl">Dashboard</p>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {l}
                </ul>
            </div>
            <div className="navbar-end mr-2">
                <div className="dropdown dropdown-left dropdown-bottom">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {l}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardNavbar;