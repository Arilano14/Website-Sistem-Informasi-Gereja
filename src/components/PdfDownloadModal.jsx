import { useState } from "react";
import { X, Download, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

const KATEGORI_OPTIONS = ["KAKR", "PERMATA", "MAMRE", "MORIA", "SAITUN"];
const SEKTOR_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

export default function PdfDownloadModal({ isOpen, onClose }) {
    const [filters, setFilters] = useState({
        sektor: "",
        kategori: "",
        domisili: "",
        statusSidi: "",
    });
    const [loading, setLoading] = useState(false);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleDownload = async () => {
        setLoading(true);
        try {
            // Build query params
            const params = new URLSearchParams({
                limit: "10000", // Fetch all data
            });
            if (filters.sektor) params.append("sektor", filters.sektor);
            if (filters.kategori) params.append("kategori", filters.kategori);

            // Handle domisili mapping
            if (filters.domisili === "kbb") params.append("domisili", "kbb");
            if (filters.domisili === "luar_kbb") params.append("domisili", "luar_kbb");

            // Handle sidi mapping
            if (filters.statusSidi === "sudah") params.append("sidi", "sudah");
            if (filters.statusSidi === "belum") params.append("sidi", "belum");

            const response = await fetch(`/api/jemaat?${params}`);
            if (!response.ok) throw new Error("Gagal mengambil data");

            const { data } = await response.json();

            if (!data || data.length === 0) {
                toast.error("Tidak ada data yang ditemukan dengan filter ini");
                setLoading(false);
                return;
            }

            // Generate PDF
            const doc = new jsPDF();

            // Title
            doc.setFontSize(18);
            doc.text("Data Jemaat GBKP", 14, 22);

            doc.setFontSize(11);
            doc.text(`Total Data: ${data.length}`, 14, 30);

            let filterText = "Filter: ";
            const activeFilters = [];
            if (filters.sektor) activeFilters.push(`Sektor ${filters.sektor}`);
            if (filters.kategori) activeFilters.push(`Kategori ${filters.kategori}`);
            if (filters.domisili) activeFilters.push(`Domisili ${filters.domisili === 'kbb' ? 'KBB' : 'Luar KBB'}`);
            if (filters.statusSidi) activeFilters.push(`Sidi ${filters.statusSidi === 'sudah' ? 'Sudah' : 'Belum'}`);

            doc.text(filterText + (activeFilters.length > 0 ? activeFilters.join(", ") : "Semua Data"), 14, 36);

            // Table
            const tableColumn = ["No", "Nama", "Sektor", "Kategori", "Umur", "Sidi", "Domisili"];
            const tableRows = [];

            data.forEach((item, index) => {
                const rowData = [
                    index + 1,
                    item.nama,
                    item.sektor,
                    item.kategori,
                    item.umur,
                    item.sdh_sidi ? "Sudah" : "Belum",
                    item.kbb ? "KBB" : "Luar KBB",
                ];
                tableRows.push(rowData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 44,
                theme: 'grid',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [41, 128, 185] },
            });

            doc.save(`data-jemaat-${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success("PDF berhasil diunduh");
            onClose();

        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error("Gagal membuat PDF");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <FileText className="text-red-500" size={24} />
                        Download Data PDF
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Pilih filter data yang ingin diunduh dalam format PDF. Kosongkan filter untuk mengunduh semua data.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Sektor Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sektor</label>
                            <select
                                value={filters.sektor}
                                onChange={(e) => handleFilterChange("sektor", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#262626] text-gray-900 dark:text-white"
                            >
                                <option value="">Semua Sektor</option>
                                {SEKTOR_OPTIONS.map((s) => (
                                    <option key={s} value={s}>Sektor {s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Kategori Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                            <select
                                value={filters.kategori}
                                onChange={(e) => handleFilterChange("kategori", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#262626] text-gray-900 dark:text-white"
                            >
                                <option value="">Semua Kategori</option>
                                {KATEGORI_OPTIONS.map((k) => (
                                    <option key={k} value={k}>{k}</option>
                                ))}
                            </select>
                        </div>

                        {/* Domisili Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Domisili</label>
                            <select
                                value={filters.domisili}
                                onChange={(e) => handleFilterChange("domisili", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#262626] text-gray-900 dark:text-white"
                            >
                                <option value="">Semua Domisili</option>
                                <option value="kbb">KBB</option>
                                <option value="luar_kbb">Luar KBB</option>
                            </select>
                        </div>

                        {/* Status Sidi Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Sidi</label>
                            <select
                                value={filters.statusSidi}
                                onChange={(e) => handleFilterChange("statusSidi", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#262626] text-gray-900 dark:text-white"
                            >
                                <option value="">Semua Status</option>
                                <option value="sudah">Sudah Sidi</option>
                                <option value="belum">Belum Sidi</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2A2A]"
                        disabled={loading}
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                <FileText size={18} />
                                <span>Download PDF</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
