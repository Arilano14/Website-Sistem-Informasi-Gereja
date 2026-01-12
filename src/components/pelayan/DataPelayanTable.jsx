import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import PelayanModal from "./PelayanModal";

export default function DataPelayanTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchData();
    }, [page, search]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                search,
            });
            const res = await fetch(`/api/pelayan?${params}`);
            const json = await res.json();
            if (json.data) {
                setData(json.data);
                setTotalPages(json.pagination.totalPages);
                setTotalItems(json.pagination.total);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Gagal mengambil data");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus data ini?")) return;

        try {
            const res = await fetch(`/api/pelayan/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Data berhasil dihapus");
                fetchData();
            } else {
                toast.error("Gagal menghapus data");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan");
        }
    };

    const handleSubmit = async (formData) => {
        try {
            const url = editingItem ? `/api/pelayan/${editingItem.id}` : "/api/pelayan";
            const method = editingItem ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(editingItem ? "Data diperbarui" : "Data ditambahkan");
                setIsModalOpen(false);
                fetchData();
            } else {
                const json = await res.json();
                toast.error(json.error || "Gagal menyimpan data");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan");
        }
    };

    return (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#E5E9F0] dark:border-[#404040] overflow-hidden">
            {/* Header Actions */}
            <div className="p-6 border-b border-[#E5E9F0] dark:border-[#404040] flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari nama atau jabatan..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-[#262626] text-gray-900 dark:text-white"
                    />
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
                >
                    <Plus size={18} />
                    <span>Tambah Pelayan</span>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-[#262626] text-gray-600 dark:text-gray-300">
                        <tr>
                            <th className="px-6 py-3 font-semibold">No</th>
                            <th className="px-6 py-3 font-semibold">Gelar / Penggelaran</th>
                            <th className="px-6 py-3 font-semibold">Jabatan</th>
                            <th className="px-6 py-3 font-semibold">Serayan Sektor</th>
                            <th className="px-6 py-3 font-semibold">No HP / WA</th>
                            <th className="px-6 py-3 font-semibold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    Memuat data...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    Tidak ada data ditemukan
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors">
                                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{item.no}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.gelar_penggelaran}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.jabatan}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.serayan_sektor}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.no_hp_wa}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-[#E5E9F0] dark:border-[#404040] flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total {totalItems} data
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-[#2A2A2A]"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Halaman {page} dari {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-[#2A2A2A]"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <PelayanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingItem}
                title={editingItem ? "Edit Data Pelayan" : "Tambah Data Pelayan"}
            />
        </div>
    );
}
