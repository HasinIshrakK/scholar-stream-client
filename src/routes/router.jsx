import { createBrowserRouter, Link } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import AllScholarships from "../pages/AllScholarships/AllScholarships";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import Auth from "../pages/Auth/Auth";
import Error from "../components/Error/Error";

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
            // { path: "about", Component: About },
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
]);