import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Filter, FileText, Printer } from "lucide-react";

export default function DownloadPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filters, setFilters] = useState({
        sektor: "",
        kategori: "",
        domisili: "",
        sidi: ""
    });

    const handleDownload = (format) => {
        const params = new URLSearchParams(filters);
        params.append("format", format);
        const url = `/api/export/jemaat.php?${params.toString()}`;

        if (format === 'pdf') {
            window.open(url, '_blank');
        } else {
            window.location.href = url;
        }
    };

    return (
        <div className="h-screen overflow-hidden bg-gray-50 dark:bg-[#121212] flex flex-col transition-colors duration-300">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50 dark:bg-[#121212]">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Export Data</h1>
                            <p className="text-gray-500 dark:text-gray-400">Unduh data jemaat dengan filter kustom.</p>
                        </div>

                        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-[#404040] p-6 md:p-8 no-scrollbar">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-[#404040]">
                                <Filter className="text-blue-600 dark:text-blue-400" size={24} />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filter Data</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sektor</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white"
                                        value={filters.sektor}
                                        onChange={e => setFilters({ ...filters, sektor: e.target.value })}
                                    >
                                        <option value="">Semua Sektor</option>
                                        {[...Array(7)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>Sektor {i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white"
                                        value={filters.kategori}
                                        onChange={e => setFilters({ ...filters, kategori: e.target.value })}
                                    >
                                        <option value="">Semua Kategori</option>
                                        <option value="KAKR">KAKR (Anak-anak)</option>
                                        <option value="PERMATA">PERMATA (Pemuda)</option>
                                        <option value="MAMRE">MAMRE (Bapak)</option>
                                        <option value="MORIA">MORIA (Ibu)</option>
                                        <option value="SAITUN">SAITUN (Lansia)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Domisili</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white"
                                        value={filters.domisili}
                                        onChange={e => setFilters({ ...filters, domisili: e.target.value })}
                                    >
                                        <option value="">Semua Domisili</option>
                                        <option value="kbb">Dalam KBB</option>
                                        <option value="luar_kbb">Luar KBB</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status Sidi</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white"
                                        value={filters.sidi}
                                        onChange={e => setFilters({ ...filters, sidi: e.target.value })}
                                    >
                                        <option value="">Semua</option>
                                        <option value="Ya">Sudah Sidi</option>
                                        <option value="Belum">Belum Sidi</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-gray-100 dark:border-[#404040]">
                                <button
                                    onClick={() => handleDownload('csv')}
                                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#404040] rounded-lg hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors font-medium"
                                >
                                    <FileText size={20} /> CSV Output
                                </button>

                                <button
                                    onClick={() => handleDownload('pdf')}
                                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
                                >
                                    <Printer size={20} /> PDF Output
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
