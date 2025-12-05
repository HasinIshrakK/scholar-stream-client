import React from 'react';
import Navbar from '../components/Navabar/Navbar';
import Footer from '../components/Footer/Footer';

const RootLayout = () => {
    return (
        <>
            <Navbar />
            <div className='m-6 md:mx-20'>
                ScholerStream
            </div>
            <Footer />
        </>
    );
};

export default RootLayout;