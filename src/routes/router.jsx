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
import Failed from "../pages/Dashboard/Payment/Failed";
import EditApplication from "../pages/Dashboard/MyApplications/EditApplication";
import AllReviews from "../pages/Dashboard/AllReviews/AllReviews";
import AllApplications from "../pages/Dashboard/AllApplications/AllApplications";
import AddScholarship from "../pages/Dashboard/AddScholarship/AddScholarship";
import ManageScholarships from "../pages/Dashboard/ManageScholarships/ManageScholarships";
import ManageUsers from "../pages/Dashboard/ManageUsers/ManageUsers";
import EditScholarship from "../pages/Dashboard/EditScholarship/EditScholarship";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ModeratorRoute from "./ModeratorRoute";

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
        element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
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

            // moderator routes
            {
                path: "/dashboard/all-applications",
                element: <ModeratorRoute><AllApplications></AllApplications></ModeratorRoute>
            },
            {
                path: "/dashboard/all-reviews",
                element: <ModeratorRoute><AllReviews></AllReviews></ModeratorRoute>
            },

            // dummy
            {
                path: "/dashboard/edit/:id",
                Component: EditApplication,
            },

            // admin routes
            {
                path: "/dashboard/add-scholarship",
                element: <AdminRoute><AddScholarship></AddScholarship></AdminRoute>
            },
            {
                path: "/dashboard/manage-scholarships",
                element: <AdminRoute><ManageScholarships></ManageScholarships></AdminRoute>
            },
            {
                path: "/dashboard/edit-scholarship/:id",
                element: <AdminRoute><EditScholarship></EditScholarship></AdminRoute>
            },
            {
                path: "/dashboard/manage-users",
                element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute>
            },

            // payment routes
            {
                path: "/dashboard/payment-success",
                Component: Success,
            },
            {
                path: "/dashboard/payment-failed/:id",
                Component: Failed,
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