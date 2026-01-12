import { useState, useMemo, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  Plus,
  Search,
  Filter,

  Download,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  Eye,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

const KATEGORI_OPTIONS = ["KAKR", "PERMATA", "MAMRE", "MORIA", "SAITUN"];
const SEKTOR_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

const KATEGORI_COLORS = {
  KAKR: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300",
  PERMATA:
    "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300",
  MAMRE:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
  MORIA:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300",
  SAITUN:
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300",
};

const SortIcon = ({ column, sortConfig }) => {
  if (sortConfig.key !== column) return null;
  return sortConfig.direction === "asc" ? (
    <ChevronUp size={14} className="text-blue-600" />
  ) : (
    <ChevronDown size={14} className="text-blue-600" />
  );
};

const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  isEdit = false,
  formData,
  setFormData,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#E5E9F0] dark:border-[#404040]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#1F2937] dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded-lg disabled:opacity-50"
            >
              <X
                size={20}
                className="text-[#475569] dark:text-white dark:text-opacity-70"
              />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Row 1: Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium text-[#475569] dark:text-white dark:text-opacity-70 mb-2">
              Nama Lengkap *
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-[#E5E9F0] dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#262626] text-[#1F2937] dark:text-white disabled:opacity-50"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          {/* Row 2: Sektor & Kategori */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sektor */}
            <div>
              <label className="block text-sm font-medium text-[#475569] dark:text-white dark:text-opacity-70 mb-2">
                Sektor *
              </label>
              <select
                value={formData.sektor}
                onChange={(e) =>
                  setFormData({ ...formData, sektor: e.target.value })
                }
                required
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-[#E5E9F0] dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#262626] text-[#1F2937] dark:text-white disabled:opacity-50"
              >
                <option value="" disabled>Pilih Sektor</option>
                {SEKTOR_OPTIONS.map((sektor) => (
                  <option key={sektor} value={sektor}>
                    Sektor {sektor}
                  </option>
                ))}
              </select>
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-[#475569] dark:text-white dark:text-opacity-70 mb-2">
                Kategorial *
              </label>
              <select
                value={formData.kategori}
                onChange={(e) =>
                  setFormData({ ...formData, kategori: e.target.value })
                }
                required
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-[#E5E9F0] dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#262626] text-[#1F2937] dark:text-white disabled:opacity-50"
              >
                <option value="" disabled>Pilih Kategorial</option>
                {KATEGORI_OPTIONS.map((kategori) => (
                  <option key={kategori} value={kategori}>
                    {kategori}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Tanggal Lahir */}
          <div>
            <label className="block text-sm font-medium text-[#475569] dark:text-white dark:text-opacity-70 mb-2">
              Tanggal Lahir
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <input
                  type="number"
                  value={formData.tgl_lahir}
                  onChange={(e) =>
                    setFormData({ ...formData, tgl_lahir: e.target.value })
                  }
                  min="1"
                  max="31"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-[#E5E9F0] dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#262626] text-[#1F2937] dark:text-white disabled:opacity-50"
                  placeholder="DD"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={formData.bln_lahir}
                  onChange={(e) =>
                    setFormData({ ...formData, bln_lahir: e.target.value })
                  }
                  min="1"
                  max="12"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-[#E5E9F0] dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#262626] text-[#1F2937] dark:text-white disabled:opacity-50"
                  placeholder="MM"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={formData.thn_lahir}
                  onChange={(e) =>
                    setFormData({ ...formData, thn_lahir: e.target.value })
                  }
                  min="1900"
                  max="2100"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-[#E5E9F0] dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#262626] text-[#1F2937] dark:text-white disabled:opacity-50"
                  placeholder="YYYY"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Status Sidi & Domisili */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Sidi */}
            <div>
              <label className="block text-sm font-medium text-[#475569] dark:text-white dark:text-opacity-70 mb-3">
                Status Sidi
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() =>
                    !isSubmitting &&
                    setFormData({ ...formData, sdh_sidi: true, blm_sidi: false })
                  }
                  className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center transition-all ${formData.sdh_sidi
                    ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300"
                    : "border-[#E5E9F0] dark:border-[#404040] hover:bg-gray-50 dark:hover:bg-[#262626] text-[#1F2937] dark:text-white"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.sdh_sidi
                        ? "border-blue-600"
                        : "border-gray-400"
                        }`}
                    >
                      {!!formData.sdh_sidi && (
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium">Sudah Sidi</span>
                  </div>
                </div>

                <div
                  onClick={() =>
                    !isSubmitting &&
                    setFormData({ ...formData, sdh_sidi: false, blm_sidi: true })
                  }
                  className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center transition-all ${formData.blm_sidi
                    ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300"
                    : "border-[#E5E9F0] dark:border-[#404040] hover:bg-gray-50 dark:hover:bg-[#262626] text-[#1F2937] dark:text-white"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.blm_sidi
                        ? "border-blue-600"
                        : "border-gray-400"
                        }`}
                    >
                      {!!formData.blm_sidi && (
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium">Belum Sidi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Domisili */}
            <div>
              <label className="block text-sm font-medium text-[#475569] dark:text-white dark:text-opacity-70 mb-3">
                Domisili
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() =>
                    !isSubmitting &&
                    setFormData({
                      ...formData,
                      kbb: true,
                      luar_kbb: false,
                      alamat_luar_kbb: "",
                    })
                  }
                  className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center transition-all ${formData.kbb
                    ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300"
                    : "border-[#E5E9F0] dark:border-[#404040] hover:bg-gray-50 dark:hover:bg-[#262626] text-[#1F2937] dark:text-white"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.kbb
                        ? "border-blue-600"
                        : "border-gray-400"
                        }`}
                    >
                      {!!formData.kbb && (
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium">KBB</span>
                  </div>
                </div>

                <div
                  onClick={() =>
                    !isSubmitting &&
                    setFormData({
                      ...formData,
                      kbb: false,
                      luar_kbb: true,
                    })
                  }
                  className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center transition-all ${formData.luar_kbb
                    ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300"
                    : "border-[#E5E9F0] dark:border-[#404040] hover:bg-gray-50 dark:hover:bg-[#262626] text-[#1F2937] dark:text-white"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.luar_kbb
                        ? "border-blue-600"
                        : "border-gray-400"
                        }`}
                    >
                      {!!formData.luar_kbb && (
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium">Luar KBB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alamat Luar KBB */}
          {formData.luar_kbb && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-medium text-[#475569] dark:text-white dark:text-opacity-70 mb-2">
                Alamat Lengkap
              </label>
              <input
                type="text"
                value={formData.alamat_luar_kbb}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    alamat_luar_kbb: e.target.value,
                  })
                }
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-[#E5E9F0] dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#262626] text-[#1F2937] dark:text-white disabled:opacity-50"
                placeholder="Masukkan alamat lengkap"
              />
            </div>
          )}


          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-[#E5E9F0] dark:border-[#404040]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-[#E5E9F0] dark:border-[#404040] rounded-lg text-[#475569] dark:text-white dark:text-opacity-70 hover:bg-[#F7F9FC] dark:hover:bg-[#262626] transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : isEdit ? (
                "Perbarui"
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function JemaatManagement() {
  const { data: user } = useUser();
  console.log("Current User:", user);
  const [jemaatData, setJemaatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSektor, setSelectedSektor] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedDomisili, setSelectedDomisili] = useState("");
  const [selectedSidi, setSelectedSidi] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [editingId, setEditingId] = useState(null); // Added for editing ID
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Added for batch delete modal

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    sektor: "",
    nama: "",
    tgl_lahir: "",
    bln_lahir: "",
    thn_lahir: "",
    kategori: "",
    sdh_sidi: false,
    blm_sidi: false,
    kbb: false,
    luar_kbb: false,
    alamat_luar_kbb: "",
  });

  useEffect(() => {
    fetchJemaatData();
  }, [currentPage, searchQuery, selectedSektor, selectedKategori, selectedDomisili, selectedSidi, sortConfig]);

  const fetchJemaatData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "15",
        sort: sortConfig.key,
        order: sortConfig.direction.toUpperCase(),
      });

      if (searchQuery) params.append("search", searchQuery);
      if (selectedSektor) params.append("sektor", selectedSektor);
      if (selectedKategori) params.append("kategori", selectedKategori);
      if (selectedDomisili) params.append("domisili", selectedDomisili);
      if (selectedSidi) params.append("sidi", selectedSidi);

      const response = await fetch(`/api/jemaat/index.php?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setJemaatData(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.total || 0);
    } catch (err) {
      console.error("Error fetching jemaat data:", err);
      setError("Gagal memuat data jemaat");
      toast.error("Gagal memuat data jemaat");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === jemaatData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(jemaatData.map((item) => item.id)));
    }
  };

  const resetForm = () => {
    setFormData({
      sektor: "",
      nama: "",
      tgl_lahir: "",
      bln_lahir: "",
      thn_lahir: "",
      kategori: "",
      sdh_sidi: false,
      blm_sidi: false,
      kbb: false,
      luar_kbb: false,
      alamat_luar_kbb: "",
    });
  };

  const validateForm = () => {
    if (!formData.nama) return "Nama Lengkap wajib diisi";
    if (!formData.sektor) return "Sektor wajib diisi";
    if (!formData.kategori) return "Kategori wajib diisi";
    if (!formData.tgl_lahir || !formData.bln_lahir || !formData.thn_lahir) return "Tanggal lahir lengkap wajib diisi";
    if (!formData.sdh_sidi && !formData.blm_sidi) return "Status Sidi wajib dipilih";
    if (!formData.kbb && !formData.luar_kbb) return "Domisili wajib dipilih";

    // Address validation skipped as per request: "kecuali alamat jika diluar KKB (opsional)"

    return null;
  };

  const handleAddJemaat = async (e) => {
    e.preventDefault();

    if (user?.role !== 'admin') {
      toast.error("Bukan admin tidak bisa edit data", { duration: 3000 });
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/jemaat/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to add jemaat");
      }

      // Consume body to ensure request is complete
      await response.json();

      setShowAddModal(false);
      resetForm();
      fetchJemaatData();
      toast.success("Data jemaat berhasil ditambahkan");
    } catch (err) {
      console.error("Error adding jemaat:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditJemaat = async (e) => {
    e.preventDefault();

    if (user?.role !== 'admin') {
      toast.error("Bukan admin tidak bisa edit data", { duration: 3000 });
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Use query param for ID to be safe with shared hosting routing
      const response = await fetch(`/api/jemaat/index.php?id=${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update jemaat");
      }

      setShowEditModal(false);
      setEditingItem(null);
      resetForm();
      fetchJemaatData();
      toast.success("Data jemaat berhasil diperbarui");
    } catch (err) {
      console.error("Error updating jemaat:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJemaat = async (id) => {
    if (user?.role !== 'admin') {
      toast.error("Bukan admin tidak bisa edit data", { duration: 3000 });
      return;
    }

    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      const response = await fetch(`/api/jemaat/index.php?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete jemaat");
      }

      fetchJemaatData();
    } catch (err) {
      console.error("Error deleting jemaat:", err);
      setError(err.message);
    }
  };

  const handleBatchDelete = async () => {
    if (user?.role !== 'admin') {
      toast.error("Bukan admin tidak bisa edit data", { duration: 3000 });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/jemaat/index.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedItems) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete selected items");
      }

      const data = await response.json();
      toast.success(data.message);
      setSelectedItems(new Set());
      setShowDeleteModal(false);
      fetchJemaatData();
    } catch (err) {
      console.error("Error deleting items:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      sektor: item.sektor.toString(),
      nama: item.nama,
      tgl_lahir: item.tgl_lahir?.toString() || "",
      bln_lahir: item.bln_lahir?.toString() || "",
      thn_lahir: item.thn_lahir?.toString() || "",
      kategori: item.kategori,
      sdh_sidi: !!item.sdh_sidi,
      blm_sidi: !!item.blm_sidi,
      kbb: !!item.kbb,
      luar_kbb: !!item.luar_kbb,
      alamat_luar_kbb: item.alamat_luar_kbb || "",
    });
    setShowEditModal(true);
  };

  // Placeholder for reset function used in the new button structure
  const reset = () => {
    resetForm();
  };

  const handleEdit = (item) => {
    if (user?.role !== 'admin') {
      toast.error("Bukan admin tidak bisa edit data", { duration: 3000 });
      return;
    }
    openEditModal(item);
  };

  const handleDelete = (item) => {
    if (user?.role !== 'admin') {
      toast.error("Bukan admin tidak bisa edit data", { duration: 3000 });
      return;
    }
    handleDeleteJemaat(item.id);
  };

  // Unused columns definition removed

  return (
    <div className="p-6 bg-gradient-to-br from-[#F1F7FF] to-[#E8E9FF] dark:from-[#1A1A1A] dark:to-[#1E1E1E] min-h-full">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#1F2937] dark:text-white dark:text-opacity-87 mb-2">
            Data Jemaat
          </h1>
          <button
            onClick={() => {
              if (user?.role !== 'admin') {
                toast.error("Bukan admin tidak bisa edit data", { duration: 3000 });
                return;
              }
              setEditingId(null);
              reset();
              setShowAddModal(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Tambah Jemaat</span>
          </button>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#E5E9F0] dark:border-[#404040] p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8] dark:text-white dark:text-opacity-50"
              />
              <input
                type="text"
                placeholder="Cari nama jemaat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#E5E9F0] dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#262626] text-[#1F2937] dark:text-white"
              />
            </div>

            <select
              value={selectedSektor}
              onChange={(e) => setSelectedSektor(e.target.value)}
              className="px-3 py-2 border border-[#E5E9F0] dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#262626] text-[#1F2937] dark:text-white"
            >
              <option value="">Semua Sektor</option>
              {SEKTOR_OPTIONS.map((sektor) => (
                <option key={sektor} value={sektor}>
                  Sektor {sektor}
                </option>
              ))}
            </select>

            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="px-3 py-2 border border-[#E5E9F0] dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#262626] text-[#1F2937] dark:text-white"
            >
              <option value="">Semua Kategorial</option>
              {KATEGORI_OPTIONS.map((kategori) => (
                <option key={kategori} value={kategori}>
                  {kategori}
                </option>
              ))}
            </select>

            <select
              value={selectedDomisili}
              onChange={(e) => setSelectedDomisili(e.target.value)}
              className="px-3 py-2 border border-[#E5E9F0] dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#262626] text-[#1F2937] dark:text-white"
            >
              <option value="">Domisili</option>
              <option value="kbb">KBB</option>
              <option value="luar_kbb">Luar KBB</option>
            </select>

            <select
              value={selectedSidi}
              onChange={(e) => setSelectedSidi(e.target.value)}
              className="px-3 py-2 border border-[#E5E9F0] dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#262626] text-[#1F2937] dark:text-white"
            >
              <option value="">Status Sidi</option>
              <option value="sudah">Sudah Sidi</option>
              <option value="belum">Belum Sidi</option>
            </select>
          </div>

          {/* Result Count & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mt-4">
            {(searchQuery || selectedSektor || selectedKategori || selectedDomisili || selectedSidi) ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-100 dark:border-blue-800 transition-all animate-in fade-in slide-in-from-left-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="font-medium">
                  Ditemukan <span className="font-bold">{totalItems}</span> data jemaat
                </span>
              </div>
            ) : (
              <div></div> /* Spacer when no count is shown */
            )}

            <div className="flex gap-2 w-full sm:w-auto">
              {selectedItems.size > 0 && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex-1 sm:flex-none shadow-sm animate-in fade-in slide-in-from-right-2"
                >
                  <Trash2 size={18} />
                  <span>Hapus {selectedItems.size} Data</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {
        error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-800 dark:text-red-300 hover:text-red-600"
            >
              ×
            </button>
          </div>
        )
      }

      {/* Data Table */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#E5E9F0] dark:border-[#404040] overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Table Header */}
          <div className="bg-[#F9FAFC] dark:bg-[#262626] px-6 py-3 border-b border-[#E5E9F0] dark:border-[#404040]">
            <div className="flex items-center">
              <div className="w-6 mr-4">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.size === jemaatData.length &&
                    jemaatData.length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded border-[#CBD2E3] dark:border-[#404040] text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1 grid grid-cols-8 gap-4 text-sm font-medium text-[#475569] dark:text-white dark:text-opacity-70">
                <button
                  onClick={() => handleSort("nama")}
                  className="flex items-center space-x-1 text-left hover:text-[#1F2937] dark:hover:text-white"
                >
                  <span>Nama</span>
                  <SortIcon column="nama" sortConfig={sortConfig} />
                </button>
                <button
                  onClick={() => handleSort("sektor")}
                  className="flex items-center space-x-1 text-left hover:text-[#1F2937] dark:hover:text-white"
                >
                  <span>Sektor</span>
                  <SortIcon column="sektor" sortConfig={sortConfig} />
                </button>
                <span>Tanggal Lahir</span>
                <button
                  onClick={() => handleSort("kategori")}
                  className="flex items-center space-x-1 text-left hover:text-[#1F2937] dark:hover:text-white"
                >
                  <span>Kategori</span>
                  <SortIcon column="kategori" sortConfig={sortConfig} />
                </button>
                <span>Status Sidi</span>
                <span>Domisili</span>
                <span>Alamat</span>
                <span>Aksi</span>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#F1F3F6] dark:divide-[#404040]">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : jemaatData.length === 0 ? (
              <div className="p-8 text-center text-[#475569] dark:text-white dark:text-opacity-70">
                <FileText size={48} className="mx-auto mb-4 text-[#94A3B8]" />
                <p>Tidak ada data jemaat</p>
              </div>
            ) : (
              jemaatData.map((item) => {
                const isSelected = selectedItems.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`px-6 py-4 hover:bg-[#F8FAFF] dark:hover:bg-[#2A2A2A] transition-colors ${isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                  >
                    <div className="flex items-center">
                      <div className="w-6 mr-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectItem(item.id)}
                          className="rounded border-[#CBD2E3] dark:border-[#404040] text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1 grid grid-cols-8 gap-4 items-center text-sm">
                        <div className="font-medium text-[#1F2937] dark:text-white dark:text-opacity-87">
                          {item.nama}
                        </div>
                        <div className="text-[#475569] dark:text-white dark:text-opacity-70">
                          Sektor {item.sektor}
                        </div>
                        <div className="text-[#475569] dark:text-white dark:text-opacity-70">
                          {item.tgl_lahir && item.bln_lahir && item.thn_lahir
                            ? `${item.tgl_lahir}/${item.bln_lahir}/${item.thn_lahir}`
                            : "-"}
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${KATEGORI_COLORS[item.kategori] ||
                              "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {item.kategori}
                          </span>
                        </div>
                        <div className="text-[#475569] dark:text-white dark:text-opacity-70">
                          {item.sdh_sidi
                            ? "Sudah Sidi"
                            : item.blm_sidi
                              ? "Belum Sidi"
                              : "-"}
                        </div>
                        <div className="text-[#475569] dark:text-white dark:text-opacity-70">
                          {item.kbb ? "KBB" : item.luar_kbb ? "Luar KBB" : "-"}
                        </div>
                        <div className="text-[#475569] dark:text-white dark:text-opacity-70 truncate">
                          {item.alamat_luar_kbb || "-"}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 text-[#475569] dark:text-white dark:text-opacity-70 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-1.5 text-[#475569] dark:text-white dark:text-opacity-70 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {
        totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-[#475569] dark:text-white dark:text-opacity-70">
              Halaman {currentPage} dari {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-[#E5E9F0] dark:border-[#404040] rounded-lg text-[#475569] dark:text-white dark:text-opacity-70 hover:bg-[#F7F9FC] dark:hover:bg-[#262626] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-[#E5E9F0] dark:border-[#404040] rounded-lg text-[#475569] dark:text-white dark:text-opacity-70 hover:bg-[#F7F9FC] dark:hover:bg-[#262626] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )
      }

      {/* Modals */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddJemaat}
        title="Tambah Jemaat Baru"
        formData={formData}
        setFormData={setFormData}
      />

      <FormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingItem(null);
          resetForm();
        }}
        onSubmit={handleEditJemaat}
        title="Edit Data Jemaat"
        isEdit={true}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Upload Modal Placeholder */}
      {/* Delete Confirmation Modal */}
      {
        showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
              <h3 className="text-xl font-bold text-[#1F2937] dark:text-white mb-4">
                Konfirmasi Hapus
              </h3>
              <p className="text-[#475569] dark:text-gray-300 mb-6">
                Apakah anda yakin hapus <span className="font-bold text-red-600">{selectedItems.size}</span> data tersebut?
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-[#E5E9F0] dark:border-[#404040] rounded-lg text-[#475569] dark:text-white hover:bg-[#F7F9FC] dark:hover:bg-[#262626] transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleBatchDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menghapus...
                    </>
                  ) : (
                    "Konfirmasi"
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      }

    </div >
  );
}
