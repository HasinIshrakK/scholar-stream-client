import React from 'react';
import AnalyticsDashboard from '../../../components/Analytics';
import Loader from '../../../components/Loader';
import useRole from '../../../hooks/useRole';
import useAuth from '../../../hooks/useAuth';

const DashboardHome = () => {
    const { loading } = useAuth();
    const { role, roleLoading } = useRole()

    if (loading || roleLoading) {
        return <Loader></Loader>
    }

    if (role !== 'admin') {
        return <h1 className='text-6xl text-center py-48'>Welcome To Dashboard</h1>
    }

    return (
        <div>
            <h1 className='text-6xl text-center py-8'>Welcome To Dashboard</h1>
            <AnalyticsDashboard />
        </div>
    );
};

export default DashboardHome;