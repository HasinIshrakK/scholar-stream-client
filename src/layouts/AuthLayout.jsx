import React from 'react';
import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (<div className=" md:grid grid-cols-2 xl:grid-cols-3">
        <div className="min-h-screen w-full bg-linear-to-br from-cyan-300 to-indigo-700 mx-auto xl:col-span-2 justify-center items-center hidden md:flex">
            <div className="text-white space-y-4 flex-col justify-center items-center hidden sm:flex p-2">
                <h1 className="md:text-4xl xl:text-6xl font-bold lg:text-center">
                    Study In Your Favorite Institution
                </h1>
                <p className="text-2xl">
                    We are glad to see you here
                </p>
            </div>
        </div>
        <Outlet />
    </div>
    );
};

export default AuthLayout;