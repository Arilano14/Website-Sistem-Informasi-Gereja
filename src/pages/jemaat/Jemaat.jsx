import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import JemaatManagement from "@/components/JemaatManagement";

export default function JemaatPage() {
    const { data: user, loading } = useUser();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            window.location.href = "/account/signin";
        }
    }, [user, loading]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="h-screen overflow-hidden bg-gray-50 dark:bg-[#121212]">
            {/* Header */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main Content */}
            <div className="flex h-[calc(100vh-64px)] relative">
                {/* Sidebar Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden dark:bg-black dark:bg-opacity-70"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto">
                    <JemaatManagement />
                </div>
            </div>
        </div>
    );
}
