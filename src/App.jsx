import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SignInPage from "./pages/auth/SignIn";
import SignUpPage from "./pages/auth/SignUp";
import JemaatPage from "./pages/jemaat/Jemaat";
import KalenderPage from "./pages/kalender/Kalender";
import StatistikPage from "./pages/statistik/Statistik";
import UsersManagementPage from "./pages/admin/Users";

import DataPelayan from "./pages/admin/DataPelayan";
import DownloadPage from "./pages/Download";

// Simple Protected Route wrapper could be added here
const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
    },
    {
        path: "/account/signin",
        element: <SignInPage />,
    },
    {
        path: "/account/signup",
        element: <SignUpPage />,
    },
    {
        path: "/jemaat",
        element: <JemaatPage />,
    },
    {
        path: "/kalender",
        element: <KalenderPage />,
    },
    {
        path: "/statistik",
        element: <StatistikPage />,
    },
    {
        path: "/admin/users",
        element: <UsersManagementPage />,
    },
    {
        path: "/admin/data-pelayan",
        element: <DataPelayan />,
    },
    {
        path: "/download",
        element: <DownloadPage />,
    },
]);

import { ThemeProvider } from "@/components/theme-provider";

export default function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}
