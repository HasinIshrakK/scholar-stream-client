import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { Outlet } from 'react-router';

const RootLayout = () => {
    return (
        <>
            <Navbar />
            <div className='mx-6 md:mx-20'>
                <Outlet></Outlet>
            </div>
            <Footer />
        </>
    );
};

export default RootLayout;