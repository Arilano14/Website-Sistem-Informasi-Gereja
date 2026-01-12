import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Search } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { toast } from "sonner";
import useUser from "@/utils/useUser";

export default function DataPelayan() {
    const { data: currentUser } = useUser();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [pelayan, setPelayan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        gelar_penggelaran: "",
        jabatan: "Pertua",
        serayan_sektor: "1",
        no_hp_wa: ""
    });

    useEffect(() => {
        fetchPelayan();
    }, []);

    const fetchPelayan = async () => {
        try {
            const res = await fetch("/api/pelayan/index.php");
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Gagal mengambil data");
            }
            const data = await res.json();
            setPelayan(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data pelayan");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editMode
                ? `/api/pelayan/index.php?id=${selectedId}`
                : "/api/pelayan/index.php";
            const method = editMode ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Gagal menyimpan data");
            }

            await res.json();
            toast.success(editMode ? "Data berhasil diupdate" : "Data berhasil ditambahkan");
            setShowModal(false);
            fetchPelayan();
            resetForm();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (currentUser?.role !== 'admin') {
            toast.error("Bukan admin tidak bisa edit data");
            return;
        }

        if (!confirm("Yakin ingin menghapus data ini?")) return;
        try {
            const res = await fetch(`/api/pelayan/index.php?id=${id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Gagal menghapus");
            toast.success("Data dihapus");
            fetchPelayan();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const openEdit = (item) => {
        if (currentUser?.role !== 'admin') {
            toast.error("Bukan admin tidak bisa edit data");
            return;
        }

        setEditMode(true);
        setSelectedId(item.id);
        setFormData({
            gelar_penggelaran: item.gelar_penggelaran,
            jabatan: item.jabatan,
            serayan_sektor: item.serayan_sektor,
            no_hp_wa: item.no_hp_wa || ""
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            gelar_penggelaran: "",
            jabatan: "Pertua",
            serayan_sektor: "1",
            no_hp_wa: ""
        });
        setEditMode(false);
        setSelectedId(null);
    };

    const JABATAN_PRIORITY = [
        "BPMR/KETUA",
        "BPMR/KABID KOINONIA",
        "BPMR/KABID MARTURIA",
        "BPMR/KABID DIAKONIA",
        "BPMR/SEKRETARIS",
        "BPMR/WAKIL SEKRETARIS",
        "BPMR/BENDEHARA",
        "SEKSI DANA & USAHA",
        "PENGEPKEP PERMATA",
        "SEKSI IBADAH",
        "PENGEPKEP MORIA",
        "PENGEPKEP MAMRE",
        "PENGEPKEP KAKR",
        "SEKSI PENGADAAN/PERAWATAN INVENTARIS GEREJA",
        "PERTUA",
        "DIAKEN"
    ];

    const getJabatanPriority = (jabatan) => {
        if (!jabatan) return 999;
        const index = JABATAN_PRIORITY.findIndex(p => p.toUpperCase() === jabatan.toUpperCase());
        return index !== -1 ? index : 999;
    };

    const filteredData = pelayan
        .filter(item =>
            (item.gelar_penggelaran || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.jabatan || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const priorityA = getJabatanPriority(a.jabatan);
            const priorityB = getJabatanPriority(b.jabatan);

            // Primary sort: Priority Index (Ascending)
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            // Secondary sort: Name (Ascending)
            return (a.gelar_penggelaran || "").localeCompare(b.gelar_penggelaran || "");
        });

    return (
        <div className="h-screen overflow-hidden bg-gray-50 dark:bg-[#121212] flex flex-col transition-colors duration-300">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-[#121212]">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Data Pelayan</h1>
                        <button
                            onClick={() => {
                                if (currentUser?.role !== 'admin') {
                                    toast.error("Bukan admin tidak bisa edit data");
                                    return;
                                }
                                resetForm();
                                setShowModal(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={18} /> Tambah Pelayan
                        </button>
                    </div>

                    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-[#404040]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                            <input
                                type="text"
                                placeholder="Cari nama atau jabatan..."
                                className="w-full pl-10 pr-4 py-2 border dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-[#404040]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50 dark:bg-[#2A2A2A] border-b border-gray-100 dark:border-[#404040]">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">Nama / Gelar</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">Jabatan</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">Sektor</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">No HP</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-[#404040]">
                                    {loading ? (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 italic">Memuat data...</td></tr>
                                    ) : filteredData.length === 0 ? (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 italic">Tidak ada data ditemukan</td></tr>
                                    ) : (
                                        filteredData.map((item) => (
                                            <tr key={item.id} className="hover:bg-blue-50/50 dark:hover:bg-[#262626] transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900 dark:text-white">{item.gelar_penggelaran}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                                        {item.jabatan}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{item.serayan_sektor}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 font-mono text-sm">{item.no_hp_wa || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mx-2 transition-colors"><Edit2 size={18} /></button>
                                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"><Trash2 size={18} /></button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-[#404040] transform transition-all scale-100">
                        {/* Modal Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-100 dark:border-[#404040] flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
                                    {editMode ? <Edit2 size={20} /> : <Plus size={20} />}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editMode ? "Edit Data Pelayan" : "Tambah Pelayan Baru"}
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 hover:bg-white/50 rounded-full transition-all"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Nama Lengkap */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    Nama Lengkap / Gelar <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-3 pr-3 py-2.5 border border-gray-200 dark:border-[#404040] rounded-lg bg-gray-50/50 dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all group-hover:border-blue-300"
                                        placeholder="Contoh: Pt. Nama Lengkap"
                                        value={formData.gelar_penggelaran}
                                        onChange={e => setFormData({ ...formData, gelar_penggelaran: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Jabatan */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        Jabatan <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        className="w-full px-3 py-2.5 border border-gray-200 dark:border-[#404040] rounded-lg bg-gray-50/50 dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-[#333]"
                                        value={JABATAN_PRIORITY.includes(formData.jabatan) ? formData.jabatan : (formData.jabatan ? "Lainnya..." : "")}
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (val === "Lainnya...") {
                                                setFormData({ ...formData, jabatan: "" });
                                            } else {
                                                setFormData({ ...formData, jabatan: val });
                                            }
                                        }}
                                    >
                                        <option value="" disabled>Pilih Jabatan</option>
                                        {JABATAN_PRIORITY.map((jabatan) => (
                                            <option key={jabatan} value={jabatan}>{jabatan}</option>
                                        ))}
                                        <option value="Lainnya..." className="font-semibold text-blue-600">+ Jabatan Lainnya...</option>
                                    </select>

                                    {/* Custom Input Animation */}
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${(!JABATAN_PRIORITY.includes(formData.jabatan) && formData.jabatan !== undefined) ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50/30 dark:bg-blue-900/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none placeholder-blue-400"
                                            placeholder="Tulis nama jabatan..."
                                            value={formData.jabatan}
                                            onChange={e => setFormData({ ...formData, jabatan: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Sektor */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Sektor <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className="w-full px-3 py-2.5 border border-gray-200 dark:border-[#404040] rounded-lg bg-gray-50/50 dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all cursor-pointer"
                                        value={formData.serayan_sektor}
                                        onChange={e => setFormData({ ...formData, serayan_sektor: e.target.value })}
                                    >
                                        {[...Array(7)].map((_, i) => <option key={i + 1} value={String(i + 1)}>Sektor {i + 1}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* No HP */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">No HP / WhatsApp</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-[#404040] rounded-lg bg-gray-50/50 dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Contoh: 0812..."
                                    value={formData.no_hp_wa}
                                    onChange={e => setFormData({ ...formData, no_hp_wa: e.target.value })}
                                />
                            </div>

                            <div className="pt-6 flex gap-3 border-t border-gray-100 dark:border-[#404040] mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 border border-gray-200 dark:border-[#404040] rounded-xl hover:bg-gray-50 dark:hover:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 font-medium transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all transform active:scale-95"
                                >
                                    Simpan Data
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
