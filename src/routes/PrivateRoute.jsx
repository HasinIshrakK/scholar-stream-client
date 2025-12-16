import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import Loader from '../components/Loader';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <Loader />
    }

    if (!user) {
        return <Navigate state={location.pathname} to="/auth/login"></Navigate>
    }

    return children;
};

export default PrivateRoute;