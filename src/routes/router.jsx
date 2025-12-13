import { createBrowserRouter, Link } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import AllScholarships from "../pages/AllScholarships/AllScholarships";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import Auth from "../pages/Auth/Auth";
import Error from "../components/Error/Error";
import ScholarshipDetails from "../pages/ScholarshipDetails/ScholarshipDetails";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import MyProfile from "../pages/Dashboard/MyProfile/MyProfile";
import MyApplications from "../pages/Dashboard/MyApplications/MyApplications";
import MyReviews from "../pages/Dashboard/MyReviews/MyReviews";
import Success from "../pages/Dashboard/Payment/Success";
import Cancel from "../pages/Dashboard/Payment/Cancel";
import EditApplication from "../pages/Dashboard/MyApplications/EditApplication";
import AllReviews from "../pages/Dashboard/AllReviews/AllReviews";
import AllApplications from "../pages/Dashboard/AllApplications/AllApplications";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        errorElement: <div className="min-h-screen items-center flex flex-col">
            <Error></Error>
            <Link to='/'>
                <button className="btn btn-primary">
                    Go Home
                </button>
            </Link>
        </div>,
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path: "/all-scholarships",
                Component: AllScholarships,
            },
            {
                path: "/scholarships/:id",
                Component: ScholarshipDetails,
            },
            {
                path: "/auth",
                Component: Auth,
                children: [
                    { path: "login", Component: Login },
                    { path: "register", Component: Register },
                ],
            },
            {
                path: "/*",
                element: <div className="min-h-screen items-center flex flex-col">
                    <Error></Error>
                    <Link to='/'>
                        <button className="btn btn-primary">
                            Go Home
                        </button>
                    </Link>
                </div>,
            },
        ],
    },
    {
        path: "/dashboard",
        Component: DashboardLayout,
        errorElement: <div className="min-h-screen items-center flex flex-col">
            <Error></Error>
            <Link to='/'>
                <button className="btn btn-primary">
                    Go Home
                </button>
            </Link>
        </div>,
        children: [
            {
                index: true,
                Component: DashboardHome,
            },
            {
                path: "/dashboard/my-profile",
                Component: MyProfile,
            },
            {
                path: "/dashboard/my-applications",
                Component: MyApplications,
            },
            {
                path: "/dashboard/my-reviews",
                Component: MyReviews,
            },


            {
                path: "/dashboard/all-applications",
                Component: AllApplications,
            },
            {
                path: "/dashboard/all-reviews",
                Component: AllReviews,
            },

            {
                path: "/dashboard/edit/:id",
                Component: EditApplication,
            },


            {
                path: "/dashboard/payment-success",
                Component: Success,
            },
            {
                path: "/dashboard/payment-cancelled",
                Component: Cancel,
            },
            {
                path: "/dashboard/*",
                element: <div className="min-h-screen items-center flex flex-col">
                    <Error></Error>
                    <Link to='/'>
                        <button className="btn btn-primary">
                            Go Home
                        </button>
                    </Link>
                </div>,
            },
        ],
    },
]);