import { useState, useEffect } from "react";
import {
    BarChart3,
    Users,
    PieChart as PieChartIcon,
    TrendingUp,
} from "lucide-react";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import useUser from "@/utils/useUser";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function StatistikPage() {
    const { data: user, loading } = useUser();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(false);

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            window.location.href = "/account/signin";
        }
    }, [user, loading]);

    // Fetch statistics
    useEffect(() => {
        if (!user) return;

        const fetchStats = async () => {
            setLoadingStats(true);
            try {
                // Use the main dashboard endpoint which has all the stats we need
                const response = await fetch("/api/dashboard/index.php");
                if (!response.ok) {
                    throw new Error("Failed to fetch statistics");
                }
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching statistics:", error);
                // No mock fallback, let it show 0 or error to be honest
                setStats(null);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, [user]);

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

    // Prepare data for charts
    const sektorChartData =
        stats?.sektorData?.map((s) => ({
            name: `Sektor ${s.sektor}`,
            total: s.total,
            kbb: s.kbb,
            luar_kbb: s.luar_kbb,
        })) || [];

    const kategoriTotalData =
        stats?.sektorData?.reduce(
            (acc, s) => {
                acc[0].value += s.kategori.KAKR;
                acc[1].value += s.kategori.PERMATA;
                acc[2].value += s.kategori.MAMRE;
                acc[3].value += s.kategori.MORIA;
                acc[4].value += s.kategori.SAITUN;
                return acc;
            },
            [
                { name: "KAKR", value: 0 },
                { name: "PERMATA", value: 0 },
                { name: "MAMRE", value: 0 },
                { name: "MORIA", value: 0 },
                { name: "SAITUN", value: 0 },
            ],
        ) || [];

    const kbbDistributionData = [
        { name: "Dalam KBB", value: stats?.totalStats?.totalKBB || 0 },
        { name: "Luar KBB", value: stats?.totalStats?.totalLuarKBB || 0 },
    ];

    const COLORS = {
        kategori: ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"],
        kbb: ["#3B82F6", "#94A3B8"],
        sektor: "#6366F1",
    };

    return (
        <div className="h-screen overflow-hidden bg-gray-50 dark:bg-[#121212]">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex h-[calc(100vh-64px)] relative">
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden dark:bg-black dark:bg-opacity-70"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <div className="flex-1 overflow-auto">
                    <div className="p-6 max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Statistik Demografi
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Analisis dan visualisasi data jemaat
                            </p>
                        </div>

                        {loadingStats ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <>
                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-200 dark:border-[#404040] p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Total Jemaat
                                            </h3>
                                            <Users
                                                size={20}
                                                className="text-blue-600 dark:text-blue-400"
                                            />
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {stats?.totalStats?.totalJemaat || 0}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Seluruh jemaat terdaftar
                                        </p>
                                    </div>

                                    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-200 dark:border-[#404040] p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Luar KBB
                                            </h3>
                                            <Users
                                                size={20}
                                                className="text-green-600 dark:text-green-400"
                                            />
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {stats?.totalStats?.totalKBB || 0}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {stats?.totalStats?.totalJemaat > 0
                                                ? `${Math.round((stats.totalStats.totalKBB / stats.totalStats.totalJemaat) * 100)}% dari total`
                                                : "0% dari total"}
                                        </p>
                                    </div>

                                    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-200 dark:border-[#404040] p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Dalam KBB
                                            </h3>
                                            <Users
                                                size={20}
                                                className="text-purple-600 dark:text-purple-400"
                                            />
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {stats?.totalStats?.totalLuarKBB || 0}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {stats?.totalStats?.totalJemaat > 0
                                                ? `${Math.round((stats.totalStats.totalLuarKBB / stats.totalStats.totalJemaat) * 100)}% dari total`
                                                : "0% dari total"}
                                        </p>
                                    </div>

                                    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-200 dark:border-[#404040] p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Sudah Sidi
                                            </h3>
                                            <TrendingUp
                                                size={20}
                                                className="text-indigo-600 dark:text-indigo-400"
                                            />
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {stats?.totalStats?.totalSidiTotal || 0}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {stats?.totalStats?.totalJemaat > 0
                                                ? `${Math.round((stats.totalStats.totalSidiTotal / stats.totalStats.totalJemaat) * 100)}% dari total`
                                                : "0% dari total"}
                                        </p>
                                    </div>
                                </div>

                                {/* Charts Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                    {/* Sektor Distribution Bar Chart */}
                                    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-200 dark:border-[#404040] p-6">
                                        <div className="flex items-center space-x-2 mb-6">
                                            <BarChart3
                                                size={20}
                                                className="text-indigo-600 dark:text-indigo-400"
                                            />
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Distribusi per Sektor
                                            </h3>
                                        </div>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={sektorChartData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{ fill: "#6B7280", fontSize: 12 }}
                                                />
                                                <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: "#fff",
                                                        border: "1px solid #E5E7EB",
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                                <Legend />
                                                <Bar
                                                    dataKey="total"
                                                    fill={COLORS.sektor}
                                                    name="Total Jemaat"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Kategori Distribution Pie Chart */}
                                    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-200 dark:border-[#404040] p-6">
                                        <div className="flex items-center space-x-2 mb-6">
                                            <PieChartIcon
                                                size={20}
                                                className="text-purple-600 dark:text-purple-400"
                                            />
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Distribusi Kategori
                                            </h3>
                                        </div>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={kategoriTotalData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) =>
                                                        `${name} (${(percent * 100).toFixed(0)}%)`
                                                    }
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {kategoriTotalData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                COLORS.kategori[index % COLORS.kategori.length]
                                                            }
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* KBB vs Luar KBB per Sektor */}
                                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-200 dark:border-[#404040] p-6 mb-6">
                                    <div className="flex items-center space-x-2 mb-6">
                                        <BarChart3
                                            size={20}
                                            className="text-blue-600 dark:text-blue-400"
                                        />
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Luar KBB vs Dalam KBB per Sektor
                                        </h3>
                                    </div>
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={sektorChartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fill: "#6B7280", fontSize: 12 }}
                                            />
                                            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#fff",
                                                    border: "1px solid #E5E7EB",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            <Legend />
                                            <Bar dataKey="kbb" fill="#3B82F6" name="Luar KBB" />
                                            <Bar dataKey="luar_kbb" fill="#94A3B8" name="Dalam KBB" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Detailed Sektor Table */}
                                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-200 dark:border-[#404040] p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Detail Statistik per Sektor
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200 dark:border-[#404040]">
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Sektor
                                                    </th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Total
                                                    </th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        KBB
                                                    </th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Luar KBB
                                                    </th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        KAKR
                                                    </th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        PERMATA
                                                    </th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        MAMRE
                                                    </th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        MORIA
                                                    </th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        SAITUN
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats?.sektorData?.map((sektor) => (
                                                    <tr
                                                        key={sektor.sektor}
                                                        className="border-b border-gray-100 dark:border-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors"
                                                    >
                                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                                            Sektor {sektor.sektor}
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-gray-300 font-semibold">
                                                            {sektor.total}
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                                                            {sektor.kbb}
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                                                            {sektor.luar_kbb}
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                                                            {sektor.kategori.KAKR}
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                                                            {sektor.kategori.PERMATA}
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                                                            {sektor.kategori.MAMRE}
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                                                            {sektor.kategori.MORIA}
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                                                            {sektor.kategori.SAITUN}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
