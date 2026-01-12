import { useState, useEffect } from "react";
import { Menu, X, Bell, User, LogOut } from "lucide-react";
import useUser from "@/utils/useUser";
import useAuth from "@/utils/useAuth";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header({ sidebarOpen, setSidebarOpen }) {
  const { data: user } = useUser();
  const { signOut } = useAuth();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState({ birthdays: [], logs: [] });
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Fetch notifications when dropdown is opened
  useEffect(() => {
    if (showNotifications) {
      const fetchNotifications = async () => {
        setLoadingNotifications(true);
        try {
          const res = await fetch("/api/notifications");
          if (res.ok) {
            const data = await res.json();
            setNotifications(data);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setLoadingNotifications(false);
        }
      };
      fetchNotifications();
    }
  }, [showNotifications]);

  const unreadCount = (notifications.birthdays?.length || 0) + (notifications.logs?.length || 0);

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: "/account/signin",
        redirect: true,
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#1E1E1E] border-b border-[#E5E9F0] dark:border-[#404040]">
      <div className="h-16 flex items-center justify-between px-4 sm:px-6">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors"
          >
            {sidebarOpen ? (
              <X
                size={20}
                className="text-[#1A2433] dark:text-white dark:text-opacity-87"
              />
            ) : (
              <Menu
                size={20}
                className="text-[#1A2433] dark:text-white dark:text-opacity-87"
              />
            )}
          </button>

          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <img
              src="/images/logo_gbkp-removebg-preview.png"
              alt="Logo GBKP"
              className="w-8 h-8 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-[#1F2937] dark:text-white dark:text-opacity-87">
                Sistem Jemaat
              </h1>
              <p className="text-xs text-[#475569] dark:text-white dark:text-opacity-70">
                GBKP Management System
              </p>
            </div>
          </div>
        </div>



        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-[#F7F9FC] dark:hover:bg-[#262626] transition-colors relative"
            >
              <Bell
                size={18}
                className="text-[#475569] dark:text-white dark:text-opacity-70"
              />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-[#1E1E1E] rounded-lg shadow-lg border border-[#E5E9F0] dark:border-[#404040] py-2 z-50 max-h-[80vh] overflow-y-auto">
                <div className="px-4 py-2 border-b border-[#F1F3F6] dark:border-[#404040] flex justify-between items-center">
                  <h3 className="font-semibold text-[#1F2937] dark:text-white">Notifikasi</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X size={16} />
                  </button>
                </div>

                {loadingNotifications ? (
                  <div className="p-4 text-center text-sm text-gray-500">Memuat...</div>
                ) : (
                  <>
                    {/* Birthdays Section */}
                    {notifications.birthdays && notifications.birthdays.length > 0 && (
                      <div className="px-4 py-3 border-b border-[#F1F3F6] dark:border-[#404040]">
                        <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                          Ulang Tahun
                        </h4>
                        <div className="space-y-2">
                          {notifications.birthdays.map((b) => {
                            const today = new Date();
                            const isToday = b.tgl_lahir === today.getDate() && b.bln_lahir === (today.getMonth() + 1);
                            return (
                              <div key={b.id} className="flex items-start space-x-3 text-sm">
                                <div className={`w-2 h-2 mt-1.5 rounded-full ${isToday ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {b.nama} <span className="text-gray-500 font-normal text-xs">({isToday ? 'Hari Ini' : 'Besok'})</span>
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Sektor {b.sektor} • Usia {new Date().getFullYear() - b.thn_lahir}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Activity Logs Section */}
                    <div className="px-4 py-3">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Aktivitas Terbaru
                      </h4>
                      {notifications.logs && notifications.logs.length > 0 ? (
                        <div className="space-y-3">
                          {notifications.logs.map((log) => (
                            <div key={log.id} className="flex items-start space-x-3 text-sm">
                              <div className={`mt-0.5 p-1 rounded-full ${log.action === 'CREATE' ? 'bg-green-100 text-green-600' :
                                log.action === 'UPDATE' ? 'bg-blue-100 text-blue-600' :
                                  'bg-red-100 text-red-600'
                                }`}>
                                {log.action === 'CREATE' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                                {log.action === 'UPDATE' && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                                {log.action === 'DELETE' && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                              </div>
                              <div>
                                <p className="text-gray-900 dark:text-white">
                                  <span className="font-medium">{log.user_name}</span>
                                  <span className="text-gray-500"> {log.action === 'CREATE' ? 'menambahkan' : log.action === 'UPDATE' ? 'mengubah' : 'menghapus'} </span>
                                  <span className="font-medium">{log.entity_name}</span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(log.created_at).toLocaleString('id-ID', {
                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Belum ada aktivitas</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#F7F9FC] dark:hover:bg-[#262626] transition-colors"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${user?.role === 'admin'
                  ? "from-blue-400 via-blue-500 to-cyan-500" // Admin: Blue Gradient
                  : "from-emerald-400 via-green-500 to-teal-500" // User: Green Gradient
                }`}>
                <User size={16} className="text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-[#1F2937] dark:text-white dark:text-opacity-87">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-[#475569] dark:text-white dark:text-opacity-70">
                  {user?.role === 'admin' ? "Admin" : "Pengguna"}
                </p>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1E1E1E] rounded-lg shadow-lg border border-[#E5E9F0] dark:border-[#404040] py-2 z-50">
                <div className="px-4 py-2 border-b border-[#F1F3F6] dark:border-[#404040]">
                  <p className="text-sm font-medium text-[#1F2937] dark:text-white dark:text-opacity-87">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-[#475569] dark:text-white dark:text-opacity-70">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-[#475569] dark:text-white dark:text-opacity-70 hover:bg-[#F7F9FC] dark:hover:bg-[#262626] transition-colors text-left"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Keluar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


    </header>
  );
}
