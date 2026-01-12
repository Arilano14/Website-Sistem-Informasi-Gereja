import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function PelayanModal({ isOpen, onClose, onSubmit, initialData, title }) {
    const [formData, setFormData] = useState({
        no: "",
        gelar_penggelaran: "",
        jabatan: "",
        serayan_sektor: "",
        no_hp_wa: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                no: "",
                gelar_penggelaran: "",
                jabatan: "",
                serayan_sektor: "",
                no_hp_wa: ""
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No</label>
                        <input
                            type="number"
                            name="no"
                            value={formData.no}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#262626] text-gray-900 dark:text-white"
                            placeholder="Nomor Urut"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gelar / Penggelaran *</label>
                        <input
                            type="text"
                            name="gelar_penggelaran"
                            required
                            value={formData.gelar_penggelaran}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#262626] text-gray-900 dark:text-white"
                            placeholder="Contoh: Pdt. Nama Lengkap"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jabatan *</label>
                        <input
                            type="text"
                            name="jabatan"
                            required
                            value={formData.jabatan}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#262626] text-gray-900 dark:text-white"
                            placeholder="Contoh: Ketua Runggun"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serayan Sektor</label>
                        <input
                            type="text"
                            name="serayan_sektor"
                            value={formData.serayan_sektor}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#262626] text-gray-900 dark:text-white"
                            placeholder="Contoh: Sektor 1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No HP / WA</label>
                        <input
                            type="text"
                            name="no_hp_wa"
                            value={formData.no_hp_wa}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#262626] text-gray-900 dark:text-white"
                            placeholder="081234567890"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2A2A]"
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
