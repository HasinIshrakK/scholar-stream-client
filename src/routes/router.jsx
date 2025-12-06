import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import AllScholarships from "../pages/AllScholarships/AllScholarships";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
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
            // {
            //     path: "auth",
            //     Component: AuthLayout,
            //     children: [
            //         { path: "login", Component: Login },
            //         { path: "register", Component: Register },
            //     ],
            // },
        ],
    },
]);