import { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Calendar,
  Database,
  ArrowRight,
  Plus,
  Eye,
  Gift,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  const [sektorData, setSektorData] = useState([]);
  const [totalStats, setTotalStats] = useState({
    totalJemaat: 0,
    totalKBB: 0,
    totalLuarKBB: 0,
    totalSidiTotal: 0,
  });
  const [birthdayData, setBirthdayData] = useState({
    birthdaysToday: [],
    birthdaysTomorrow: [],
    incompleteBirthdates: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch from the single PHP endpoint we created
      const response = await fetch("/api/dashboard/index.php"); // Explicit path for XAMPP

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();

      setSektorData(data.sektorData || []);
      setTotalStats(data.totalStats || {
        totalJemaat: 0,
        totalKBB: 0,
        totalLuarKBB: 0,
        totalSidiTotal: 0,
      });
      setBirthdayData(data.birthdayData || {
        birthdaysToday: [],
        birthdaysTomorrow: [],
        incompleteBirthdates: [],
      });

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Gagal memuat data dashboard: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const kategoriColors = {
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32"
              ></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-[#F1F7FF] to-[#E8E9FF] dark:from-[#1A1A1A] dark:to-[#1E1E1E] min-h-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#1F2937] dark:text-white dark:text-opacity-87 mb-2">
          Dashboard Sistem Jemaat GBKP
        </h1>
        <p className="text-[#475569] dark:text-white dark:text-opacity-70">
          Ringkasan data jemaat per sektor dan statistik keseluruhan
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#E5E9F0] dark:border-[#404040] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#475569] dark:text-white dark:text-opacity-70">
                Total Jemaat
              </p>
              <p className="text-2xl font-bold text-[#1F2937] dark:text-white dark:text-opacity-87">
                {totalStats.totalJemaat}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#E5E9F0] dark:border-[#404040] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#475569] dark:text-white dark:text-opacity-70">
                Luar KBB
              </p>
              <p className="text-2xl font-bold text-[#1F2937] dark:text-white dark:text-opacity-87">
                {totalStats.totalKBB}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp
                size={24}
                className="text-green-600 dark:text-green-400"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#E5E9F0] dark:border-[#404040] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#475569] dark:text-white dark:text-opacity-70">
                KBB
              </p>
              <p className="text-2xl font-bold text-[#1F2937] dark:text-white dark:text-opacity-87">
                {totalStats.totalLuarKBB}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Calendar
                size={24}
                className="text-orange-600 dark:text-orange-400"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#E5E9F0] dark:border-[#404040] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#475569] dark:text-white dark:text-opacity-70">
                Sudah Sidi
              </p>
              <p className="text-2xl font-bold text-[#1F2937] dark:text-white dark:text-opacity-87">
                {totalStats.totalSidiTotal}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Database
                size={24}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#E5E9F0] dark:border-[#404040] p-6">
          <h3 className="text-lg font-semibold text-[#1F2937] dark:text-white dark:text-opacity-87 mb-4">
            Aksi Cepat
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => (window.location.href = "/jemaat")}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus size={16} />
              <span>Tambah Jemaat Baru</span>
            </button>
            <button
              onClick={() => (window.location.href = "/jemaat")}
              className="flex items-center space-x-2 px-4 py-2 border border-[#E5E9F0] dark:border-[#404040] text-[#475569] dark:text-white dark:text-opacity-70 hover:bg-[#F7F9FC] dark:hover:bg-[#262626] rounded-lg transition-colors"
            >
              <Eye size={16} />
              <span>Lihat Semua Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Birthday and Incomplete Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Birthdays Today */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#E5E9F0] dark:border-[#404040] p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
              <Gift size={20} className="text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#1F2937] dark:text-white">
              Ulang Tahun Hari Ini
            </h3>
          </div>
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {birthdayData.birthdaysToday.length > 0 ? (
              birthdayData.birthdaysToday.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#262626] rounded-lg">
                  <div>
                    <p className="font-medium text-[#1F2937] dark:text-white">{item.nama}</p>
                    <p className="text-xs text-[#475569] dark:text-white dark:text-opacity-70">
                      Sektor {item.sektor} • {item.kategori}
                    </p>
                  </div>
                  <div className="text-sm font-bold text-pink-600 dark:text-pink-400">
                    {item.umur} Thn
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#475569] dark:text-white dark:text-opacity-70 text-center py-4">
                Tidak ada yang ulang tahun hari ini
              </p>
            )}
          </div>
        </div>

        {/* Birthdays Tomorrow */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#E5E9F0] dark:border-[#404040] p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#1F2937] dark:text-white">
              Ulang Tahun Besok
            </h3>
          </div>
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {birthdayData.birthdaysTomorrow.length > 0 ? (
              birthdayData.birthdaysTomorrow.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#262626] rounded-lg">
                  <div>
                    <p className="font-medium text-[#1F2937] dark:text-white">{item.nama}</p>
                    <p className="text-xs text-[#475569] dark:text-white dark:text-opacity-70">
                      Sektor {item.sektor} • {item.kategori}
                    </p>
                  </div>
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {item.umur ? item.umur + 1 : "-"} Thn
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#475569] dark:text-white dark:text-opacity-70 text-center py-4">
                Tidak ada yang ulang tahun besok
              </p>
            )}
          </div>
        </div>

        {/* Incomplete Data */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#E5E9F0] dark:border-[#404040] p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#1F2937] dark:text-white">
              Data Belum Lengkap
            </h3>
          </div>
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {birthdayData.incompleteBirthdates.length > 0 ? (
              birthdayData.incompleteBirthdates.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#262626] rounded-lg">
                  <div>
                    <p className="font-medium text-[#1F2937] dark:text-white">{item.nama}</p>
                    <p className="text-xs text-[#475569] dark:text-white dark:text-opacity-70">
                      Sektor {item.sektor} • {item.kategori}
                    </p>
                  </div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                    Tgl Lahir
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#475569] dark:text-white dark:text-opacity-70 text-center py-4">
                Semua data lengkap
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sektor Cards */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#1F2937] dark:text-white dark:text-opacity-87 mb-4">
          Ringkasan per Sektor
        </h2>
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {sektorData.map((sektor) => (
              <div
                key={sektor.sektor}
                className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#E5E9F0] dark:border-[#404040] p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#1F2937] dark:text-white dark:text-opacity-87">
                    Sektor {sektor.sektor}
                  </h3>
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {sektor.total} jemaat
                  </div>
                </div>

                {/* Kategori Breakdown */}
                <div className="space-y-3 mb-4">
                  <h4 className="text-sm font-medium text-[#475569] dark:text-white dark:text-opacity-70">
                    Kategori
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(sektor.kategori || {}).map(
                      ([kategori, count]) => (
                        <div
                          key={kategori}
                          className="flex items-center justify-between"
                        >
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${kategoriColors[kategori] || "bg-gray-100 text-gray-800"}`}
                          >
                            {kategori}
                          </span>
                          <span className="text-sm font-medium text-[#1F2937] dark:text-white dark:text-opacity-87">
                            {count}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Domisili Breakdown */}
                <div className="space-y-3 mb-4">
                  <h4 className="text-sm font-medium text-[#475569] dark:text-white dark:text-opacity-70">
                    Domisili
                  </h4>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-[#475569] dark:text-white dark:text-opacity-70">
                        Luar KBB
                      </span>
                    </div>
                    <span className="font-medium text-[#1F2937] dark:text-white dark:text-opacity-87">
                      {sektor.kbb || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-[#475569] dark:text-white dark:text-opacity-70">
                        KBB
                      </span>
                    </div>
                    <span className="font-medium text-[#1F2937] dark:text-white dark:text-opacity-87">
                      {sektor.luar_kbb || 0}
                    </span>
                  </div>
                </div>

                {/* Link to Detail */}
                <button
                  onClick={() =>
                    (window.location.href = `/jemaat?sektor=${sektor.sektor}`)
                  }
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-sm"
                >
                  <span>Lihat Detail</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
