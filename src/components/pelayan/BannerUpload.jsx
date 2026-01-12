import { useState, useEffect } from "react";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function BannerUpload() {
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBanner();
    }, []);

    const fetchBanner = async () => {
        try {
            const res = await fetch("/api/pelayan/banner");
            const data = await res.json();
            if (data.filename) {
                setBanner(data.filename);
            }
        } catch (error) {
            console.error("Failed to fetch banner", error);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        try {
            const res = await fetch("/api/pelayan/banner", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setBanner(data.filename);
                toast.success("Banner berhasil diupload");
            } else {
                toast.error(data.error || "Gagal upload banner");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Hapus banner ini?")) return;

        setLoading(true);
        try {
            const res = await fetch("/api/pelayan/banner", {
                method: "DELETE",
            });
            if (res.ok) {
                setBanner(null);
                toast.success("Banner dihapus");
            } else {
                toast.error("Gagal hapus banner");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl shadow-sm border border-[#E5E9F0] dark:border-[#404040] mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Banner Halaman</h3>

            <div className="relative w-full h-48 bg-gray-100 dark:bg-[#262626] rounded-lg overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                {banner ? (
                    <>
                        <img
                            src={`/uploads/banner_pelayan/${banner}`}
                            alt="Banner Pelayan"
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={handleDelete}
                            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                            title="Hapus Banner"
                        >
                            <Trash2 size={18} />
                        </button>
                    </>
                ) : (
                    <div className="text-center p-4">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada banner</p>
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                    <Upload size={18} className="mr-2" />
                    <span>{banner ? "Ganti Banner" : "Upload Banner"}</span>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={loading}
                    />
                </label>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Format: JPG, PNG. Maksimal 2MB.
                </p>
            </div>
        </div>
    );
}
