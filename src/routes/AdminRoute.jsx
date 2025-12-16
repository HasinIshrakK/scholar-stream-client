import React from 'react';
import useAuth from '../hooks/useAuth';
import Loader from '../components/Loader';
import useRole from '../hooks/useRole';
import Error from '../components/Error/Error';

const AdminRoute = ({ children }) => {
    const { loading } = useAuth();
    const { role, roleLoading } = useRole()

    if (loading || roleLoading) {
        return <Loader></Loader>
    }

    if (role !== 'admin') {
        return <Error/>
    }

    return children;
};

export default AdminRoute;