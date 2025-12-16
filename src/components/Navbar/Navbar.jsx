import React, { useContext } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = () => {

    const { user, logout } = useContext(AuthContext);

    const l = <>
        <Link to='/'>
            <li className='mr-2'>Home</li>
        </Link>
        <Link to='/all-scholarships'>
            <li className='mr-2'>All Scholarships</li>
        </Link>
        {user &&
            <Link to='/dashboard'>
                <li className='mr-2'>Dashboard</li>
            </Link>
        }
    </>

    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-10">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {l}
                    </ul>
                </div>
                <Link to='/'>
                    <p className="btn btn-ghost text-xl">ScholarStream</p>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {l}
                </ul>
            </div>
            <div className="navbar-end mr-2">
                {
                    user ? <>
                        <div className="dropdown dropdown-hover dropdown-end">
                            <div tabIndex={0} role="button" className="m-1">
                                <div className="tooltip tooltip-left" data-tip={user.displayName}>
                                    <img className='h-10 rounded-full' src={`${user.photoURL ? user.photoURL : '/user.png'}`} alt="User" />
                                </div>
                            </div>
                            <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                <Link to='/dashboard'>
                                    <button className='btn w-full'>Dashboard</button>
                                </Link>
                                <button onClick={logout} className='btn'>SignOut</button>
                            </ul>
                        </div>
                    </>
                        :
                        <>
                            <Link to='/auth/login' className="btn btn-primary">Login</Link>
                            <Link to='/auth/register' className="btn btn-primary btn-outline ml-2 hidden sm:flex">Register</Link>
                        </>
                }
            </div>
        </div>
    );
};

export default Navbar;